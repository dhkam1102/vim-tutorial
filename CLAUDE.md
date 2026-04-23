@AGENTS.md

## Agent Operating Rules

All agents defined in `.claude/agents/` MUST follow these rules.

### File size limits
- agent-notes/ files: max 200 lines and 8KB per file
- When approaching the limit, compress or split into a timestamped archive (e.g. `curriculum-audit-summary-2026-04.md`)
- MEMORY.md (auto-managed): do not write agent output here

### One writer per file
- Each agent-notes/ file has exactly one owner who may write to it
- `team-status.md` is user-only — agents read but never edit
- Agents write proposals to their own files (e.g. `agent-notes/pedagogy-proposals.md`)

### Communication via file paths
- When sharing context between agents, reference by file path — never paste file contents into messages
- Summary files are the source of truth, not conversation history

### No circular references
- agent-notes/ files must not reference each other in loops
- Dependency direction: team-status.md → audit summaries → plan files. Never reverse.

### Build gate
- No agent may report "done" without a passing `npm run build`
