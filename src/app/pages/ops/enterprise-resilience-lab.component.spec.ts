import { describe, expect, it } from 'vitest';
import { buildEnterpriseFailureScenario } from './enterprise-resilience-lab.component';

describe('enterprise resilience scenarios', () => {
	it('suppresses citations and execution when RAG is unavailable', () => {
		const scenario = buildEnterpriseFailureScenario('rag-unavailable');
		expect(scenario.status).toBe('failed');
		expect(scenario.trace.find((item) => item.label === 'Render citations')?.status).toBe('blocked');
		expect(scenario.trace.find((item) => item.label === 'Execute tools')?.status).toBe('blocked');
		expect(scenario.userMessage).toContain('No grounded answer or citations');
	});

	it('keeps server tool authorization authoritative', () => {
		const scenario = buildEnterpriseFailureScenario('policy-denied');
		expect(scenario.status).toBe('blocked');
		expect(scenario.backendDecision).toContain('Server authorization remains authoritative');
		expect(scenario.trace.at(-1)?.status).toBe('blocked');
	});

	it('never reports execution after approval rejection', () => {
		const scenario = buildEnterpriseFailureScenario('approval-rejected');
		expect(scenario.trace.find((item) => item.label === 'Execute action')?.status).toBe('blocked');
		expect(scenario.userMessage).toContain('Nothing was executed');
	});

	it('marks browser timeout as failed while preserving partial evidence', () => {
		const scenario = buildEnterpriseFailureScenario('browser-timeout');
		expect(scenario.status).toBe('failed');
		expect(scenario.retryable).toBe(true);
		expect(scenario.trace.find((item) => item.label === 'Record evidence')?.status).toBe('degraded');
	});

	it('normalizes provider timeout into explicit retryable failure', () => {
		const scenario = buildEnterpriseFailureScenario('provider-timeout');
		expect(scenario.status).toBe('failed');
		expect(scenario.retryable).toBe(true);
		expect(scenario.backendDecision).toContain('no completed assistant message');
	});

	it('cannot claim fully ready while a readiness dependency is degraded', () => {
		const scenario = buildEnterpriseFailureScenario('readiness-degraded');
		expect(scenario.status).toBe('degraded');
		expect(scenario.trace.at(-1)?.status).toBe('degraded');
		expect(scenario.backendDecision).toContain('distinguishes degraded dependencies');
	});
});
