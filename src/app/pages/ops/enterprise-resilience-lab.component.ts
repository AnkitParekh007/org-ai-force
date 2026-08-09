import { Component, computed, signal } from '@angular/core';

export type EnterpriseFailureScenarioId =
	| 'rag-unavailable'
	| 'policy-denied'
	| 'approval-rejected'
	| 'browser-timeout'
	| 'provider-timeout'
	| 'readiness-degraded';

export interface EnterpriseFailureScenario {
	id: EnterpriseFailureScenarioId;
	label: string;
	dependency: string;
	status: 'failed' | 'blocked' | 'degraded';
	retryable: boolean;
	userMessage: string;
	backendDecision: string;
	trace: Array<{ label: string; status: 'completed' | 'failed' | 'blocked' | 'degraded'; detail: string }>;
}

export function buildEnterpriseFailureScenario(id: EnterpriseFailureScenarioId): EnterpriseFailureScenario {
	switch (id) {
		case 'rag-unavailable':
			return {
				id,
				label: 'RAG unavailable',
				dependency: 'Retrieval service',
				status: 'failed',
				retryable: true,
				userMessage: 'Trusted retrieval is unavailable. No grounded answer or citations are claimed.',
				backendDecision: 'Backend suppresses grounded-answer and tool-execution paths when trusted retrieval fails.',
				trace: [
					{ label: 'Serialize visible context', status: 'completed', detail: 'Safe UI context remains inspectable.' },
					{ label: 'Retrieve sources', status: 'failed', detail: 'Deterministic retrieval dependency failure.' },
					{ label: 'Render citations', status: 'blocked', detail: 'No citations are fabricated.' },
					{ label: 'Execute tools', status: 'blocked', detail: 'No grounded plan means no execution.' },
				],
			};
		case 'policy-denied':
			return {
				id,
				label: 'Tool denied by policy',
				dependency: 'Tool authorization policy',
				status: 'blocked',
				retryable: false,
				userMessage: 'The requested tool is not allowed for this role or agent policy.',
				backendDecision: 'Server authorization remains authoritative even when the frontend can render the proposed tool.',
				trace: [
					{ label: 'Plan tool', status: 'completed', detail: 'The proposal remains visible for review.' },
					{ label: 'Check server policy', status: 'blocked', detail: 'Permission/allowlist check denies execution.' },
					{ label: 'Execute tool', status: 'blocked', detail: 'No browser-only override exists.' },
				],
			};
		case 'approval-rejected':
			return {
				id,
				label: 'Approval rejected',
				dependency: 'Human approval',
				status: 'blocked',
				retryable: false,
				userMessage: 'The operator rejected the proposed action. Nothing was executed.',
				backendDecision: 'Backend records rejection as terminal for that proposal and refuses the execution token.',
				trace: [
					{ label: 'Prepare grounded plan', status: 'completed', detail: 'Evidence and action remain visible.' },
					{ label: 'Request approval', status: 'completed', detail: 'Operator decision is explicit.' },
					{ label: 'Execute action', status: 'blocked', detail: 'Rejected approval cannot transition to success.' },
				],
			};
		case 'browser-timeout':
			return {
				id,
				label: 'Browser worker timeout',
				dependency: 'Playwright/browser worker',
				status: 'failed',
				retryable: true,
				userMessage: 'Browser automation timed out. Partial evidence is preserved; completion is not claimed.',
				backendDecision: 'Worker timeout terminates the attempt and requires a new bounded retry.',
				trace: [
					{ label: 'Dispatch browser job', status: 'completed', detail: 'Job id and requested action are recorded.' },
					{ label: 'Wait for worker', status: 'failed', detail: 'Deterministic timeout occurs before completion.' },
					{ label: 'Record evidence', status: 'degraded', detail: 'Available logs/screenshots may remain inspectable.' },
				],
			};
		case 'provider-timeout':
			return {
				id,
				label: 'Provider timeout',
				dependency: 'Model provider',
				status: 'failed',
				retryable: true,
				userMessage: 'The model provider timed out. The workspace exposes retry instead of a fabricated completion.',
				backendDecision: 'Provider failure is normalized server-side and no completed assistant message is emitted.',
				trace: [
					{ label: 'Start model request', status: 'completed', detail: 'Request metadata is available for tracing.' },
					{ label: 'Wait for provider', status: 'failed', detail: 'Deterministic provider timeout.' },
					{ label: 'Offer retry', status: 'degraded', detail: 'Retry uses the same safe user/context snapshot.' },
				],
			};
		case 'readiness-degraded':
			return {
				id,
				label: 'Readiness dependency degraded',
				dependency: 'Pilot/readiness dependency',
				status: 'degraded',
				retryable: true,
				userMessage: 'A readiness dependency is degraded. The workspace remains available with reduced confidence.',
				backendDecision: 'Readiness aggregation distinguishes degraded dependencies from fully ready status.',
				trace: [
					{ label: 'Aggregate readiness', status: 'completed', detail: 'All dependency checks remain visible.' },
					{ label: 'Evaluate dependency', status: 'degraded', detail: 'One dependency is intentionally degraded.' },
					{ label: 'Report readiness', status: 'degraded', detail: 'Overall status cannot claim fully ready.' },
				],
			};
	}
}

@Component({
	selector: 'bm-enterprise-resilience-lab',
	standalone: true,
	template: `
		<section class="resilience-lab" aria-labelledby="resilience-title">
			<header>
				<div>
					<p class="kicker">Deterministic enterprise failure lab</p>
					<h2 id="resilience-title">Degraded dependencies stay visible and governed</h2>
					<p>Mock-only scenarios. Frontend state never overrides backend authorization or claims work that did not complete.</p>
				</div>
				<span class="badge">{{ scenario().status }}</span>
			</header>

			<div class="scenario-grid" aria-label="Resilience scenarios">
				@for (option of options; track option.id) {
					<button type="button" [attr.aria-pressed]="scenario().id === option.id" [class.active]="scenario().id === option.id" (click)="select(option.id)">
						<strong>{{ option.label }}</strong><span>{{ option.dependency }}</span>
					</button>
				}
			</div>

			<div class="resilience-grid">
				<article class="panel">
					<p class="kicker">User-visible result</p>
					<h3>{{ scenario().label }}</h3>
					<p>{{ scenario().userMessage }}</p>
					@if (scenario().retryable) { <button type="button" class="retry" (click)="retry()">Run deterministic retry</button> }
					<p class="announcement" aria-live="polite">{{ announcement() }}</p>
				</article>

				<article class="panel boundary">
					<p class="kicker">Authoritative boundary</p>
					<h3>Backend decision</h3>
					<p>{{ scenario().backendDecision }}</p>
				</article>
			</div>

			<ol class="trace">
				@for (item of scenario().trace; track item.label) {
					<li><span [attr.data-state]="item.status">{{ item.status }}</span><div><strong>{{ item.label }}</strong><p>{{ item.detail }}</p></div></li>
				}
			</ol>
		</section>
	`,
	styles: [`
		.resilience-lab { margin-top: 1.5rem; padding: 1rem; border: 1px solid #334155; border-radius: 1rem; background: #0f172a; color: #e2e8f0; }
		header { display:flex; justify-content:space-between; gap:1rem; align-items:flex-start; }
		header h2 { margin:.2rem 0 .4rem; } header p { color:#cbd5e1; }
		.kicker { margin:0; color:#67e8f9 !important; text-transform:uppercase; letter-spacing:.08em; font-size:.75rem; font-weight:800; }
		.badge { border-radius:999px; padding:.35rem .65rem; background:#312e81; color:#c7d2fe; font-weight:800; text-transform:capitalize; }
		.scenario-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:.6rem; margin:1rem 0; }
		.scenario-grid button { min-height:64px; border:1px solid #334155; border-radius:.75rem; background:#111827; color:#e5e7eb; padding:.7rem; text-align:left; display:grid; gap:.2rem; cursor:pointer; }
		.scenario-grid button span { color:#94a3b8; font-size:.8rem; } .scenario-grid button.active { border-color:#22d3ee; background:#172554; }
		button:focus-visible { outline:3px solid rgba(34,211,238,.45); outline-offset:2px; }
		.resilience-grid { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; }
		.panel { border:1px solid #334155; border-radius:.75rem; background:#111827; padding:.85rem; } .panel h3 { margin:.25rem 0; } .panel p { color:#cbd5e1; line-height:1.5; }
		.boundary { border-color:#92400e; background:#1c1408; }
		.retry { min-height:44px; border:0; border-radius:999px; padding:.65rem .9rem; background:#0891b2; color:white; font-weight:800; cursor:pointer; }
		.announcement { min-height:1.3rem; font-size:.85rem; }
		.trace { list-style:none; margin:1rem 0 0; padding:0; display:grid; gap:.55rem; }
		.trace li { display:grid; grid-template-columns:100px 1fr; gap:.7rem; border:1px solid #334155; border-radius:.7rem; padding:.7rem; background:#111827; }
		.trace li p { margin:.25rem 0 0; color:#94a3b8; } .trace span { height:max-content; border-radius:999px; padding:.25rem .45rem; background:#334155; text-align:center; font-size:.75rem; font-weight:800; }
		.trace span[data-state='failed'] { background:#4c0519; color:#fecdd3; } .trace span[data-state='blocked'] { background:#3f3f46; color:#e4e4e7; } .trace span[data-state='degraded'] { background:#78350f; color:#fde68a; } .trace span[data-state='completed'] { background:#14532d; color:#bbf7d0; }
		@media(max-width:850px){ .scenario-grid{grid-template-columns:1fr 1fr}.resilience-grid{grid-template-columns:1fr} } @media(max-width:560px){header{display:grid}.scenario-grid{grid-template-columns:1fr}.trace li{grid-template-columns:1fr}}
	`],
})
export class EnterpriseResilienceLabComponent {
	protected readonly options = (['rag-unavailable','policy-denied','approval-rejected','browser-timeout','provider-timeout','readiness-degraded'] as EnterpriseFailureScenarioId[]).map(id => buildEnterpriseFailureScenario(id));
	protected readonly scenario = signal(buildEnterpriseFailureScenario('rag-unavailable'));
	protected readonly announcement = signal('RAG unavailable scenario loaded.');
	protected readonly retryCount = signal(0);
	protected readonly retryLabel = computed(() => `retry ${this.retryCount()}`);

	protected select(id: EnterpriseFailureScenarioId): void {
		this.scenario.set(buildEnterpriseFailureScenario(id)); this.retryCount.set(0); this.announcement.set(`${this.scenario().label} scenario loaded.`);
	}
	protected retry(): void {
		if (!this.scenario().retryable) return;
		this.retryCount.update(v => v + 1);
		this.announcement.set(`Deterministic ${this.retryLabel()} recorded. The scenario stays degraded until the dependency is explicitly restored.`);
	}
}
