import {
  branchControlAllowsEntry,
  branchControlAllowsRedirect,
  branchControlAllowsWrite,
  getBranchControlSnapshot,
  type BranchContainmentMode as BranchControlContainmentMode,
} from "@/lib/server/branchControl";

export type BranchId = "yorisou_dte" | "hinata_support" | "website_brand" | "operator_admin" | "synthetic_branch_lab";

export type BranchStatus = "active" | "legacy_active" | "internal";
export type BranchLifecycleState = "proposed" | "internal_only" | "limited_external" | "active" | "legacy_active" | "archived";
export type BranchVisibilityPolicy = "public" | "branch_internal" | "internal";
export type BranchCrossBranchAccessPolicy = "same_branch_only" | "explicit_bridge" | "read_only_archive";
export type BranchContainmentMode = "normal" | "entry_frozen" | "write_frozen" | "redirect_frozen" | "limited_external" | "archive";
export type BranchAgentSlot = "sovereign_branch_agent" | "public_specialist" | "internal_subagent" | "execution_shell";

export type BranchAgentGovernance = {
  current_outward_owner: string | null;
  future_public_specialist_slots: string[];
  internal_subagent_usage: string[];
  forbidden_agent_role_substitutions: string[];
  execution_shell_roles: string[];
};

export type BranchAdmissionContract = {
  branch_id: BranchId;
  branch_name: string;
  status: BranchStatus;
  branch_lifecycle_state: BranchLifecycleState;
  target_user: string;
  problem_statement: string;
  outward_facing_owner: string | null;
  primary_interface: string;
  monetization_truth: string;
  branch_data_scope: string[];
  compliance_profile: string;
  allowed_entry_routes: string[];
  forbidden_redirect_targets: string[];
  visibility_policy: BranchVisibilityPolicy;
  cross_branch_access_policy: BranchCrossBranchAccessPolicy;
  fallback_policy: "branch_default" | "strict_branch" | "archive_only" | "explicit_bridge";
  allowed_shared_services: string[];
  forbidden_inheritance: string[];
  containment_mode: BranchContainmentMode;
  agent_governance: BranchAgentGovernance;
};

export type BranchDefinition = BranchAdmissionContract;

export type BranchContext = {
  branchId: BranchId;
  sourceBranchId: BranchId | null;
  visibilityPolicy: BranchVisibilityPolicy;
  crossBranchAccessPolicy: BranchCrossBranchAccessPolicy;
};

export type BranchOperatingContract = BranchAdmissionContract & {
  control: ReturnType<typeof getBranchControlSnapshot>;
  effectiveEntryAllowed: boolean;
  effectiveWriteAllowed: boolean;
  effectiveRedirectAllowed: boolean;
};

const BRANCH_DEFINITIONS: BranchDefinition[] = [
  {
    branch_id: "yorisou_dte",
    branch_name: "Yorisou DTE",
    status: "active",
    branch_lifecycle_state: "active",
    target_user: "LINE-first mobile self-insight / companionship users",
    problem_statement: "test/result/follow-up loop",
    outward_facing_owner: "Yorisou Companion / Growth Agent",
    primary_interface: "LINE MINI App / LIFF + result loop",
    monetization_truth: "result / deep report / recurring content",
    branch_data_scope: ["completion", "result_identity", "funnel", "recurring_follow_up"],
    compliance_profile: "mobile-first, result-first, branch-contained",
    allowed_entry_routes: ["/", "/line/mini-app", "/line/next", "/line/open", "/check-in", "/result"],
    forbidden_redirect_targets: ["/support", "/en/support", "/ai-advisor", "/en/ai-advisor"],
    visibility_policy: "public",
    cross_branch_access_policy: "explicit_bridge",
    fallback_policy: "explicit_bridge",
    allowed_shared_services: ["foundation", "identity", "session", "result_identity", "funnel", "recurring_follow_up", "privacy_audit", "line_flow_routing"],
    forbidden_inheritance: ["support_default_truth", "admin_public_redirect", "legacy_hinata_flow"],
    containment_mode: "normal",
    agent_governance: {
      current_outward_owner: "Yorisou Companion / Growth Agent",
      future_public_specialist_slots: [],
      internal_subagent_usage: ["OpenClaw", "Hermes"],
      forbidden_agent_role_substitutions: ["multi_public_agent", "support_shell_as_dte"],
      execution_shell_roles: ["OpenClaw", "Hermes"],
    },
  },
  {
    branch_id: "hinata_support",
    branch_name: "Hinata Support",
    status: "legacy_active",
    branch_lifecycle_state: "legacy_active",
    target_user: "support / recommendation / problem-solving seekers",
    problem_statement: "concrete support / recommendation / follow-up / case handling",
    outward_facing_owner: "Hinata",
    primary_interface: "support web / support messaging flows",
    monetization_truth: "consultation / support conversion / service follow-up",
    branch_data_scope: ["support_cases", "messages", "voice", "consultation"],
    compliance_profile: "support-case, sensitive, canonical identity-backed",
    allowed_entry_routes: ["/support", "/ai-advisor", "/en/support", "/en/ai-advisor"],
    forbidden_redirect_targets: ["/result", "/en/result", "/line/mini-app", "/en/line/mini-app"],
    visibility_policy: "public",
    cross_branch_access_policy: "same_branch_only",
    fallback_policy: "strict_branch",
    allowed_shared_services: ["foundation", "identity", "session", "conversation", "support_case", "timeline", "privacy_audit", "voice", "openclaw"],
    forbidden_inheritance: ["dte_completion_truth", "result_share_surface", "website_brand_default"],
    containment_mode: "normal",
    agent_governance: {
      current_outward_owner: "Hinata",
      future_public_specialist_slots: [],
      internal_subagent_usage: ["OpenClaw", "Hermes"],
      forbidden_agent_role_substitutions: ["dte_companion_identity", "support_as_website_default"],
      execution_shell_roles: ["OpenClaw", "Hermes"],
    },
  },
  {
    branch_id: "website_brand",
    branch_name: "Website Brand",
    status: "active",
    branch_lifecycle_state: "limited_external",
    target_user: "trust / SEO / discovery / lead visitors",
    problem_statement: "brand explanation / branch routing / trust formation",
    outward_facing_owner: "Yorisou brand surface",
    primary_interface: "website pages / landers",
    monetization_truth: "lead / trust / branch entry",
    branch_data_scope: ["content", "lead_forms", "routing"],
    compliance_profile: "public brand, low-friction, no support default",
    allowed_entry_routes: [
      "/",
      "/about",
      "/services",
      "/contact",
      "/insights",
      "/insights/validate",
      "/pilot",
      "/products",
      "/reservation-mobility-support",
      "/en/about",
      "/en/services",
      "/en/contact",
      "/en/insights",
      "/en/insights/validate",
      "/en/pilot",
      "/en/products",
      "/en/reservation-mobility-support",
    ],
    forbidden_redirect_targets: ["/support", "/en/support"],
    visibility_policy: "public",
    cross_branch_access_policy: "explicit_bridge",
    fallback_policy: "explicit_bridge",
    allowed_shared_services: ["foundation", "content", "routing", "lead_forms", "privacy_audit", "session", "identity"],
    forbidden_inheritance: ["support_default_truth", "dte_result_truth"],
    containment_mode: "normal",
    agent_governance: {
      current_outward_owner: "Yorisou brand surface",
      future_public_specialist_slots: [],
      internal_subagent_usage: ["OpenClaw"],
      forbidden_agent_role_substitutions: ["support_shell_as_brand_default", "public_multi_agent"],
      execution_shell_roles: ["OpenClaw"],
    },
  },
  {
    branch_id: "operator_admin",
    branch_name: "Operator Admin",
    status: "internal",
    branch_lifecycle_state: "internal_only",
    target_user: "internal operators only",
    problem_statement: "admin / audit / follow-up / operations",
    outward_facing_owner: null,
    primary_interface: "/admin/*",
    monetization_truth: "none",
    branch_data_scope: ["foundation", "audit", "support_cases", "timeline", "events"],
    compliance_profile: "internal-only",
    allowed_entry_routes: ["/admin", "/admin/*", "/api/admin/*"],
    forbidden_redirect_targets: ["/support", "/en/support"],
    visibility_policy: "internal",
    cross_branch_access_policy: "same_branch_only",
    fallback_policy: "strict_branch",
    allowed_shared_services: ["foundation", "audit", "timeline", "support_case", "operator_task", "identity", "session"],
    forbidden_inheritance: ["public_support_redirect", "public_branch_truth"],
    containment_mode: "normal",
    agent_governance: {
      current_outward_owner: null,
      future_public_specialist_slots: [],
      internal_subagent_usage: ["OpenClaw"],
      forbidden_agent_role_substitutions: ["public_agent_exposure", "support_shell_as_admin_default"],
      execution_shell_roles: ["OpenClaw"],
    },
  },
  {
    branch_id: "synthetic_branch_lab",
    branch_name: "Synthetic Branch Lab",
    status: "internal",
    branch_lifecycle_state: "internal_only",
    target_user: "operators validating branch governance",
    problem_statement: "admission / simulation / containment validation",
    outward_facing_owner: null,
    primary_interface: "internal branch admission / simulation routes",
    monetization_truth: "none",
    branch_data_scope: ["admission", "control", "snapshot", "validation"],
    compliance_profile: "synthetic, internal-only, non-public",
    allowed_entry_routes: ["/dev/branch-sim", "/api/admin/branch-admission", "/api/admin/branch-os"],
    forbidden_redirect_targets: ["/support", "/en/support", "/result", "/en/result", "/line/mini-app", "/en/line/mini-app"],
    visibility_policy: "internal",
    cross_branch_access_policy: "same_branch_only",
    fallback_policy: "strict_branch",
    allowed_shared_services: ["foundation", "audit", "branch_control", "branch_admission", "branch_observability"],
    forbidden_inheritance: ["public_branch_truth", "support_default_truth", "dte_result_truth"],
    containment_mode: "normal",
    agent_governance: {
      current_outward_owner: null,
      future_public_specialist_slots: [],
      internal_subagent_usage: ["OpenClaw"],
      forbidden_agent_role_substitutions: ["public_branch", "public_multi_agent", "support_shell_as_default"],
      execution_shell_roles: ["OpenClaw"],
    },
  },
];

function normalizePath(value: string | null | undefined) {
  if (!value) {
    return "/";
  }

  const [pathOnly] = value.split("#");
  return pathOnly.split("?")[0] || "/";
}

function matchesAllowedRoute(pathname: string, allowedRoute: string) {
  if (allowedRoute.endsWith("/*")) {
    return pathname === allowedRoute.slice(0, -2) || pathname.startsWith(allowedRoute.slice(0, -1));
  }

  return pathname === allowedRoute || pathname.startsWith(`${allowedRoute}/`);
}

function isInternalOperationalRoute(pathname: string) {
  return matchesAllowedRoute(pathname, "/admin") || matchesAllowedRoute(pathname, "/api/admin") || matchesAllowedRoute(pathname, "/dev");
}

function branchLifecycleAllowsRoute(definition: BranchDefinition, pathname: string) {
  switch (definition.branch_lifecycle_state) {
    case "archived":
      return false;
    case "internal_only":
    case "proposed":
      return isInternalOperationalRoute(pathname);
    default:
      return true;
  }
}

export function listBranchDefinitions() {
  return [...BRANCH_DEFINITIONS];
}

export function getBranchDefinition(branchId: BranchId) {
  const definition = BRANCH_DEFINITIONS.find((entry) => entry.branch_id === branchId);
  if (!definition) {
    throw new Error(`unknown_branch:${branchId}`);
  }
  return definition;
}

export function getBranchAdmissionContract(branchId: BranchId) {
  return getBranchDefinition(branchId);
}

export function getBranchOperatingContract(branchId: BranchId): BranchOperatingContract {
  const definition = getBranchDefinition(branchId);
  const control = getBranchControlSnapshot(branchId, definition.containment_mode as BranchControlContainmentMode);
  return {
    ...definition,
    control,
    effectiveEntryAllowed:
      branchLifecycleAllowsRoute(definition, definition.allowed_entry_routes[0] || "/") &&
      branchControlAllowsEntry(control) &&
      definition.branch_lifecycle_state !== "archived",
    effectiveWriteAllowed: branchControlAllowsWrite(control) && definition.branch_lifecycle_state !== "archived",
    effectiveRedirectAllowed: branchControlAllowsRedirect(control) && definition.branch_lifecycle_state !== "archived",
  };
}

export function normalizeBranchId(value: string | null | undefined): BranchId | null {
  if (
    value === "yorisou_dte" ||
    value === "hinata_support" ||
    value === "website_brand" ||
    value === "operator_admin" ||
    value === "synthetic_branch_lab"
  ) {
    return value;
  }
  return null;
}

export function resolveBranchForPath(pathname: string | null | undefined): BranchId | null {
  const normalized = normalizePath(pathname);

  if (
    matchesAllowedRoute(normalized, "/result") ||
    matchesAllowedRoute(normalized, "/check-in") ||
    matchesAllowedRoute(normalized, "/line/mini-app") ||
    matchesAllowedRoute(normalized, "/line/next") ||
    matchesAllowedRoute(normalized, "/line/open")
  ) {
    return "yorisou_dte";
  }

  if (matchesAllowedRoute(normalized, "/support") || matchesAllowedRoute(normalized, "/ai-advisor")) {
    return "hinata_support";
  }

  if (matchesAllowedRoute(normalized, "/admin")) {
    return "operator_admin";
  }

  if (matchesAllowedRoute(normalized, "/dev/branch-sim") || matchesAllowedRoute(normalized, "/api/admin/branch-admission")) {
    return "synthetic_branch_lab";
  }

  if (
    matchesAllowedRoute(normalized, "/about") ||
    matchesAllowedRoute(normalized, "/services") ||
    matchesAllowedRoute(normalized, "/contact") ||
    matchesAllowedRoute(normalized, "/insights") ||
    matchesAllowedRoute(normalized, "/products") ||
    matchesAllowedRoute(normalized, "/pilot") ||
    matchesAllowedRoute(normalized, "/reservation-mobility-support") ||
    matchesAllowedRoute(normalized, "/en/about") ||
    matchesAllowedRoute(normalized, "/en/services") ||
    matchesAllowedRoute(normalized, "/en/contact") ||
    matchesAllowedRoute(normalized, "/en/insights") ||
    matchesAllowedRoute(normalized, "/en/products") ||
    matchesAllowedRoute(normalized, "/en/pilot") ||
    matchesAllowedRoute(normalized, "/en/reservation-mobility-support")
  ) {
    return "website_brand";
  }

  return null;
}

export function resolveBranchContext(input: {
  branchId?: string | null;
  pathname?: string | null;
  returnTo?: string | null;
  intent?: string | null;
  fallbackBranchId?: BranchId;
}): BranchContext {
  const explicit = normalizeBranchId(input.branchId);
  const fromPath = resolveBranchForPath(input.pathname || input.returnTo || null);
  const fromIntent =
    input.intent === "support"
      ? ("hinata_support" as const)
      : input.intent === "register" || input.intent === "login"
        ? ("yorisou_dte" as const)
        : null;

  const branchId = explicit || fromPath || fromIntent || input.fallbackBranchId || "website_brand";
  const definition = getBranchDefinition(branchId);

  return {
    branchId,
    sourceBranchId: explicit || fromPath || fromIntent || null,
    visibilityPolicy: definition.visibility_policy,
    crossBranchAccessPolicy: definition.cross_branch_access_policy,
  };
}

export function getBranchDefaultReturnPath(branchId: BranchId, locale: "ja" | "en") {
  switch (branchId) {
    case "yorisou_dte":
      return locale === "en" ? "/en/line/mini-app" : "/line/mini-app";
    case "hinata_support":
      return locale === "en" ? "/en/support" : "/support";
    case "operator_admin":
      return locale === "en" ? "/en/admin" : "/admin";
    case "synthetic_branch_lab":
      return locale === "en" ? "/en/dev/branch-sim" : "/dev/branch-sim";
    case "website_brand":
    default:
      return locale === "en" ? "/en/contact" : "/contact";
  }
}

export function validateBranchRedirectTarget(branchId: BranchId, target: string | null | undefined, fallback: string) {
  const normalizedTarget = normalizePath(target);
  const definition = getBranchDefinition(branchId);
  const control = getBranchControlSnapshot(branchId, definition.containment_mode as BranchControlContainmentMode);
  if (!branchLifecycleAllowsRoute(definition, normalizedTarget)) {
    return fallback;
  }
  if (!branchControlAllowsRedirect(control) || !branchControlAllowsEntry(control)) {
    return fallback;
  }
  const allowed = definition.allowed_entry_routes.some((route) => matchesAllowedRoute(normalizedTarget, route));

  if (!allowed || definition.forbidden_redirect_targets.some((route) => matchesAllowedRoute(normalizedTarget, route))) {
    return fallback;
  }

  return normalizedTarget;
}

export function getBranchAllowedEntryRoutes(branchId: BranchId) {
  return [...getBranchDefinition(branchId).allowed_entry_routes];
}
