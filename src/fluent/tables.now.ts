import '@servicenow/sdk/global'
import {
    Table,
    StringColumn,
    FloatColumn,
    BooleanColumn,
    ReferenceColumn,
    IntegerColumn,
} from '@servicenow/sdk/core'

// One row per scored run. Lux inserts it through the Legwork REST API; the
// Legwork agentic workflow triggers on create.
export const x_snc_legwork_run = Table({
    name: 'x_snc_legwork_run',
    label: 'Legwork Run',
    display: 'label',
    allowWebServiceAccess: true,
    schema: {
        label: StringColumn({ label: 'Label', maxLength: 120 }),
        runner: ReferenceColumn({ label: 'Runner', referenceTable: 'sys_user' }),
        clip: StringColumn({ label: 'Clip', maxLength: 120 }),
        overstride: FloatColumn({ label: 'Overstride (x torso)' }),
        cadence: FloatColumn({ label: 'Cadence (spm)' }),
        trunk_lean: FloatColumn({ label: 'Trunk lean (deg)' }),
        push: FloatColumn({ label: 'Push (0-1)' }),
        state: StringColumn({
            label: 'State',
            default: 'scored',
            choices: {
                scored: { label: 'Scored' },
                assessed: { label: 'Assessed' },
                closed: { label: 'Closed' },
                clear: { label: 'Within limits' },
            },
        }),
        dry_run: BooleanColumn({ label: 'Dry run', default: true }),
        assessment: ReferenceColumn({
            label: 'Risk assessment',
            referenceTable: 'sn_hs_rm_risk_assessment',
        }),
        baseline_run: ReferenceColumn({ label: 'Baseline run', referenceTable: 'x_snc_legwork_run' }),
        breaches: StringColumn({ label: 'Breaches', maxLength: 500 }),
        verdict: StringColumn({ label: 'Verdict', maxLength: 500 }),
        drills: StringColumn({ label: 'Drills', maxLength: 2000 }),
        jev_probability: FloatColumn({ label: 'Jev probability' }),
        agent_log: StringColumn({ label: 'Agent log', maxLength: 4000 }),
        step_count: IntegerColumn({ label: 'Steps logged', default: 0 }),
    },
})

// Registry of every record the agents, Jev step or REST endpoint create, so the
// Clear demo data button can remove exactly those and nothing else.
export const x_snc_legwork_created = Table({
    name: 'x_snc_legwork_created',
    label: 'Legwork Created Record',
    display: 'label',
    allowWebServiceAccess: true,
    schema: {
        label: StringColumn({ label: 'Label', maxLength: 200 }),
        target_table: StringColumn({ label: 'Table', maxLength: 80 }),
        target_id: StringColumn({ label: 'Record sys_id', maxLength: 32 }),
        run: ReferenceColumn({ label: 'Run', referenceTable: 'x_snc_legwork_run' }),
    },
})
