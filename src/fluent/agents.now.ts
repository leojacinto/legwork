import '@servicenow/sdk/global'
import { AiAgent, AiAgenticWorkflow } from '@servicenow/sdk/core'

// Invoke ACL is checked against the agent's role mask, which holds x_snc_legwork.user (not admin).
const ADMIN_ROLE = 'd526601cca98422a98ab78afedc13b6d'

// Roles the agents inherit from the signed-in runner: assessment writer, action
// writer, and the Legwork role that guards the run and registry tables.
const DATA_ACCESS = {
    roleMap: ['sn_hs_rm.risk_assessment_writer', 'sn_ohs_im.action_writer', 'x_snc_legwork.user'],
    description: 'Create assessments and corrective actions for Legwork runs',
}

export const formAssessor = AiAgent({
    $id: Now.ID['legwork_form_assessor'],
    name: 'Legwork Form Assessor',
    description: 'Scores a runner\'s form against limits and opens an injury risk assessment when a limit is breached',
    agentRole: 'Running form safety assessor',
    recordType: 'custom',
    agentDescriptor: 'created_by_build_agent',
    channel: 'nap',
    processingMessage: 'Assessing running form...',
    postProcessingMessage: 'Form assessment complete',
    securityAcl: { $id: Now.ID['legwork_form_assessor_acl'], type: 'Specific role', roles: [ADMIN_ROLE] },
    dataAccess: DATA_ACCESS,
    versionDetails: [
        {
            name: 'V1',
            number: 1,
            state: 'published',
            instructions: `You assess one scored run of a runner.
Step 1: Extract the run identifier from the task.
Step 2: Use the Assess Run tool with run_id set to that identifier.
Step 3: If the tool result is clear, say the form is within limits and no assessment is needed.
Step 4: If the tool result is rescore, say this is a re-score of an open assessment and list any measures still over their limits, or say none are.
Step 5: Otherwise report which measures breached their limits and that a new assessment was opened.
Step 6: Present the result in plain English as a short bulleted list. Do not show identifiers or raw data.`,
        },
    ],
    tools: [
        {
            name: 'Assess Run',
            description: 'Assess Run: scores one run against form limits and opens or finds the injury risk assessment. Input run_id. Returns the result, the breached measures and the assessment identifier.',
            type: 'script',
            executionMode: 'autopilot',
            preMessage: 'Scoring the run against form limits...',
            postMessage: 'Run scored.',
            inputs: [{ name: 'run_id', description: 'Identifier of the scored run from the task', mandatory: true }],
            script: `(function(inputs) {
  return new x_snc_legwork.LegworkOps().assessRun(inputs.run_id);
})(inputs);`,
        },
    ],
})

export const drillCoach = AiAgent({
    $id: Now.ID['legwork_drill_coach'],
    name: 'Legwork Drill Coach',
    description: 'Assigns corrective drills as tracked actions on the runner\'s injury risk assessment',
    agentRole: 'Running drill coach',
    recordType: 'custom',
    agentDescriptor: 'created_by_build_agent',
    channel: 'nap',
    processingMessage: 'Choosing corrective drills...',
    postProcessingMessage: 'Drills assigned',
    securityAcl: { $id: Now.ID['legwork_drill_coach_acl'], type: 'Specific role', roles: [ADMIN_ROLE] },
    dataAccess: DATA_ACCESS,
    versionDetails: [
        {
            name: 'V1',
            number: 1,
            state: 'published',
            instructions: `You assign corrective drills for one run.
Step 1: Extract the run identifier from the task.
Step 2: Use the Assign Drills tool with run_id set to that identifier.
Step 3: If no drills were assigned, say why and stop.
Step 4: Otherwise list the drills that were assigned as a numbered list in plain English.`,
        },
    ],
    tools: [
        {
            name: 'Assign Drills',
            description: 'Assign Drills: creates corrective drill actions for the breached measures on the run\'s assessment. Input run_id. Returns the number of drills assigned.',
            type: 'script',
            executionMode: 'autopilot',
            preMessage: 'Assigning corrective drills...',
            postMessage: 'Drills assigned.',
            inputs: [{ name: 'run_id', description: 'Identifier of the scored run from the task', mandatory: true }],
            script: `(function(inputs) {
  return new x_snc_legwork.LegworkOps().assignDrills(inputs.run_id);
})(inputs);`,
        },
    ],
})

export const closeReviewer = AiAgent({
    $id: Now.ID['legwork_close_reviewer'],
    name: 'Legwork Close Reviewer',
    description: 'Compares a re-scored run with the earlier one, asks Jev whether form improved enough, and closes or keeps open the assessment',
    agentRole: 'Assessment close reviewer',
    recordType: 'custom',
    agentDescriptor: 'created_by_build_agent',
    channel: 'nap',
    processingMessage: 'Reviewing improvement...',
    postProcessingMessage: 'Review complete',
    securityAcl: { $id: Now.ID['legwork_close_reviewer_acl'], type: 'Specific role', roles: [ADMIN_ROLE] },
    dataAccess: DATA_ACCESS,
    versionDetails: [
        {
            name: 'V1',
            number: 1,
            state: 'published',
            instructions: `You decide whether an assessment can close after a re-scored run.
Step 1: Extract the run identifier from the task.
Step 2: Use the Close Check tool with run_id set to that identifier.
Step 3: If the decision is awaiting re-score, say the first run is recorded and stop.
Step 4: Otherwise state whether the assessment closes or stays open, and give the improvement probability in plain English.`,
        },
    ],
    tools: [
        {
            name: 'Close Check',
            description: 'Close Check: compares this run with the earlier run, asks Jev if form improved enough, then closes or keeps the assessment open. Input run_id. Returns the decision and probability.',
            type: 'script',
            executionMode: 'autopilot',
            preMessage: 'Asking Jev whether form improved...',
            postMessage: 'Decision made.',
            inputs: [{ name: 'run_id', description: 'Identifier of the scored run from the task', mandatory: true }],
            script: `(function(inputs) {
  return new x_snc_legwork.LegworkOps().closeCheck(inputs.run_id);
})(inputs);`,
        },
    ],
})

export const formLoop = AiAgenticWorkflow({
    $id: Now.ID['legwork_form_loop'],
    name: 'Legwork Form Safety Loop',
    description: 'Assess a scored run, assign corrective drills, and close the injury risk assessment only when form improves',
    recordType: 'custom',
    executionMode: 'autopilot',
    securityAcl: { $id: Now.ID['legwork_form_loop_acl'], type: 'Specific role', roles: [ADMIN_ROLE] },
    dataAccess: DATA_ACCESS,
    team: {
        $id: Now.ID['legwork_form_team'],
        name: 'Legwork Form Team',
        // sys_ids of the three agents above (generated keys), as the workflow requires deployed ids.
        members: [
            'c24a14b64a3c4571b8d846f0f65ee49f', // Legwork Form Assessor
            '922ecd6b69144afab8eb2d851989b81a', // Legwork Drill Coach
            'f6ed6cccb6c748e1b6186a485d8c4ca6', // Legwork Close Reviewer
        ],
    },
    versions: [
        {
            name: 'V1',
            number: 1,
            state: 'published',
            instructions: `Process one scored run.
Step 1: Use Legwork Form Assessor to score the run and open or find the assessment.
Step 2: If the Assessor reports the form is within limits and no assessment is needed, finish.
Step 3: If the Assessor reports a new assessment was opened, use Legwork Drill Coach to assign corrective drills, then use Legwork Close Reviewer.
Step 4: If the Assessor reports a re-score of an open assessment, skip the Drill Coach and use Legwork Close Reviewer, even when no measures are over their limits.
Step 5: Summarise the outcome in two plain sentences.`,
        },
    ],
    triggerConfig: [
        {
            name: 'Legwork run scored',
            active: false,
            targetTable: 'x_snc_legwork_run',
            triggerFlowDefinitionType: 'record_create',
            triggerCondition: 'state=scored',
            objectiveTemplate: 'Process the scored Legwork run with identifier ${sys_id}',
            runAs: 'runner',
            showNotifications: false,
            channel: 'Now Assist Panel',
        },
    ],
})
