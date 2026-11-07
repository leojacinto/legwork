# Legwork

Runner form assessment on ServiceNow, built as a Lux (AIUX) app. A treadmill clip is analysed in the browser, the form is scored against limits, and an AI Agent Studio workflow opens a risk assessment, assigns corrective drills and closes the assessment only when a second session shows better form. Scope `x_snc_legwork`. Demo only, not for production.

## How it works

1. The page plays a clip and MediaPipe Pose Landmarker (client side only) reads 33 body landmarks per frame.
2. `lib/biomech.js` turns the landmarks into belt position, step rate, forward lean and stride reach.
3. When the clip ends, the median of each measure is posted to `POST /api/x_snc_legwork/legwork/runs`.
4. That endpoint saves the run and starts the **Legwork Form Safety Loop** workflow with `sn_aia.AiAgentRuntimeUtil.startAiAgentConversation`.
5. Three agents work through the `LegworkOps` Script Include, each step appended to the run's `agent_log`:
   - **Form Assessor** scores the run and opens or finds a `sn_hs_rm_risk_assessment`.
   - **Drill Coach** creates `sn_ohs_im_action` corrective drills on it.
   - **Close Reviewer** compares with the earlier session, asks Jev whether form improved, and closes or keeps the assessment open.
6. The page polls `GET /runs/{id}` and shows agent progress, the drills, a before and after chart and an assessment (Improved, No change, Declined, Baseline set). On load it reopens the signed-in user's latest run.
7. **Open case** slides the risk assessment in beside the video: a d3 risk meter from Session 1 to Session 2 (Low, Moderate, High), the close decision, the corrective drills as a checklist and a link to the record. In dry run it is a labelled preview because no record exists. Live mode sets the assessment's inherent and residual risk, adds work notes and closes the drills when the assessment closes.
8. Every record the agents create is listed in `x_snc_legwork_created`. The Clear demo data button deletes exactly those.

The clip plays once and is scored, then keeps looping with a fade at the seam. Only the first pass is scored. The pose model loads when the page opens and the wireframe shows on a paused frame, so Start does not stall.

Dry run is the default: the agents log what they would create and write nothing to the safety tables. The toggle at the bottom of the page switches to live.

## Layout

| Path | What |
|---|---|
| `pages/home/page.js` | Page: run posting, progress polling, dry run toggle, Clear demo data |
| `pages/home/components/legwork-stage.js` | Video, skeleton overlay, MediaPipe, Session 1 and 2 tabs |
| `pages/home/components/legwork-gauges.js` | d3 gauges and sparklines |
| `pages/home/components/legwork-agents.js` | Agent progress strip (`aiux-node-map`) and agent output |
| `pages/home/components/legwork-compare.js` | d3 before and after bars and the assessment box |
| `lib/` | Pose feed, form analysis, run summary |
| `src/fluent/` | Tables, role and ACLs, REST API, Script Include, Jev property, agents and workflow |
| `src/server/LegworkOps.server.js` | Agent tool logic: limits, drills, Jev call, clear |
| `media/` | The two demo clips |

## Build and deploy

```bash
pnpm install
pnpm build
pnpm run deploy      # not `pnpm deploy`, that is a pnpm built-in
pnpm dev             # local Lux dev server
```

Copy `.env.example` to `.env` and set your instance and credentials. `.env` is ignored by git.

## First install

1. **Jev key.** Set the system property `x_snc_legwork.typesafe_api_key` on the instance. The source only has a placeholder and the property is install-once, so redeploys do not overwrite it. Without it the close check falls back to a rule check.
2. **Role.** Give the demo user the role `x_snc_legwork.user`. The agents run with that role plus `sn_hs_rm.risk_assessment_writer` and `sn_ohs_im.action_writer`.
3. **Clips.** The AIUX static host refuses mp4 files, and redeploys wipe attachments on the app record. Attach `media/session-1.mp4` and `media/session-2.mp4` to a record outside the app source (this project uses the system property `x_snc_legwork.demo_video_holder`), then put the attachment sys_ids into `CLIPS` in `pages/home/components/legwork-stage.js`:

   ```bash
   curl -X POST -H "Authorization: <auth header>" -H "Content-Type: video/mp4" \
     --data-binary @media/session-1.mp4 \
     "https://<instance>/api/now/attachment/file?table_name=sys_properties&table_sys_id=<record sys_id>&file_name=session-1.mp4"
   ```

4. **Demo flow.** Open `/aiux/legwork/home`, run Session 1 (baseline), wait for the agents (about 5 minutes), run Session 2. The assessment box compares the two.

## Limits

The limits in `LegworkOps` are set between the two demo clips so Session 1 raises an assessment and Session 2 clears it: step rate below 188 steps a minute, forward lean above 7.6 degrees, stride reach above 1.1 torso lengths. They are not clinical values. For other footage, re-measure and move them (see `LIMITS` in `src/server/LegworkOps.server.js`).

## Known gaps

- **Step rate is noisy.** The same footage can read 20 to 40 steps a minute apart depending on compression, so a before and after on step rate alone is not solid. Forward lean is steadier.
- **Record trigger is off.** The workflow also has a record trigger on `x_snc_legwork_run`, deployed inactive because it depends on the instance flow engine. The run endpoint starts the workflow directly. To use the trigger, set it active in `src/fluent/agents.now.ts` and remove the direct start in the `/runs` endpoint, or every session starts the workflow twice.
- **Dry run counts as a baseline.** A dry session with issues is the baseline for the next one, even though no assessment record exists.
- **Voice is not built.** Voice agents and the voice APIs exist on some instances, but the live voice experience depends on features that are not generally available, so there is no voice coach here.
- **No page ACL.** The page has no `@acl` decorator.
- **External downloads.** The pose model and WASM load from jsDelivr and Google Storage at run time.
- **Risk assessment numbers repeat.** On the test instance several assessments shared one number. The app does not cause it.
