# Yorisou Agent Contract Standard v0.1

**Status:** Approved  
**Owner / Approver:** Edward

Every Agent must define:

```yaml
agent_id:
display_name:
project: yorisou
layer:
purpose:
status: planned|active|paused|retired
version:
trigger_events:
input_schema:
output_schema:
allowed_tools:
allowed_providers:
data_classification:
data_access_scope:
automatic_actions:
review_required:
forbidden_actions:
cost_limit:
timeout:
retry_policy:
fallback_agent:
success_metrics:
stop_conditions:
owner:
escalation_rules:
logging_requirements:
```

No Agent may run in production without a registered contract version, minimum required data scope, output validation, cost limit, and pause mechanism.
