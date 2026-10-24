import { VNode, VNodeCondition, TweakConditionRule } from '../types/vdom';

export interface ConditionEvaluationResult {
  isVisible: boolean;
  hasCondition: boolean;
  statusText: string;
  detailMessage: string;
  ruleResults: Array<{
    ruleId: string;
    tweakId: string;
    operator: string;
    targetValues: any[];
    actualValue: any;
    passed: boolean;
  }>;
}

export function evaluateNodeVisibility(
  node: VNode,
  tweakValues: Record<string, any> = {}
): ConditionEvaluationResult {
  if (node.visible === false) {
    return {
      isVisible: false,
      hasCondition: false,
      statusText: '노드 자체 숨김',
      detailMessage: 'node.visible 속성이 false로 설정되어 있습니다.',
      ruleResults: []
    };
  }

  const cond = node.condition;
  if (!cond || !cond.enabled || !cond.rules || cond.rules.length === 0) {
    return {
      isVisible: true,
      hasCondition: false,
      statusText: '항상 표시',
      detailMessage: '별도의 표시 조건이 설정되어 있지 않습니다.',
      ruleResults: []
    };
  }

  const matchType = cond.matchType || 'and';
  const ruleResults: ConditionEvaluationResult['ruleResults'] = [];
  let passedCount = 0;

  for (const rule of cond.rules) {
    const actualValue = tweakValues[rule.tweakId];
    let passed = false;

    if (rule.operator === 'always') {
      passed = true;
    } else if (rule.operator === 'equals') {
      const target = rule.values && rule.values.length > 0 ? rule.values[0] : '';
      passed = String(actualValue) === String(target);
    } else if (rule.operator === 'not_equals') {
      const target = rule.values && rule.values.length > 0 ? rule.values[0] : '';
      passed = String(actualValue) !== String(target);
    } else if (rule.operator === 'in') {
      // Handles multiple values: matches if actualValue is in rule.values
      passed = Array.isArray(rule.values) && rule.values.some((v) => String(v) === String(actualValue));
    } else if (rule.operator === 'not_in') {
      passed = !Array.isArray(rule.values) || !rule.values.some((v) => String(v) === String(actualValue));
    }

    if (passed) passedCount++;

    ruleResults.push({
      ruleId: rule.id,
      tweakId: rule.tweakId,
      operator: rule.operator,
      targetValues: rule.values || [],
      actualValue,
      passed
    });
  }

  const isVisible =
    matchType === 'and' ? passedCount === cond.rules.length : passedCount > 0;

  let detail = '';
  if (ruleResults.length === 1) {
    const r = ruleResults[0];
    const targetStr = r.targetValues.map((v) => `'${v}'`).join(', ');
    detail = `${r.tweakId} = '${r.actualValue ?? 'undefined'}' (${r.operator} [${targetStr}])`;
  } else {
    detail = `${matchType.toUpperCase()} 조건 ${passedCount}/${ruleResults.length}개 충족`;
  }

  return {
    isVisible,
    hasCondition: true,
    statusText: isVisible ? '조건 일치 (표시 중)' : '조건 불일치 (숨김 처리)',
    detailMessage: detail,
    ruleResults
  };
}
