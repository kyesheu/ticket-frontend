-- v3.2 AI feedback, evaluation, metrics menu

DELETE FROM sys_menu WHERE menu_id BETWEEN 1130 AND 1140;

INSERT INTO sys_menu VALUES ('1130', 'AI 反馈', '1100', '6', 'ai-feedback', 'ticket/ai/feedback/index', '', 'TicketAiFeedback', 1, 0, 'C', '0', '0', 'ticket:ai:feedback:list', 'chat-line-square', 'admin', sysdate(), '', NULL, '');
INSERT INTO sys_menu VALUES ('1131', 'AI 评测', '1100', '7', 'ai-evaluation', 'ticket/ai/evaluation/index', '', 'TicketAiEvaluation', 1, 0, 'C', '0', '0', 'ticket:ai:evaluation:list', 'data-analysis', 'admin', sysdate(), '', NULL, '');
INSERT INTO sys_menu VALUES ('1132', 'AI 指标', '1100', '8', 'ai-metrics', 'ticket/ai/metrics/index', '', 'TicketAiMetrics', 1, 0, 'C', '0', '0', 'ticket:ai:metrics:view', 'trend-charts', 'admin', sysdate(), '', NULL, '');
INSERT INTO sys_menu VALUES ('1133', '反馈统计', '1130', '1', '', '', '', '', 1, 0, 'F', '0', '0', 'ticket:ai:feedback:statistics', '#', 'admin', sysdate(), '', NULL, '');
INSERT INTO sys_menu VALUES ('1134', '执行评测', '1131', '1', '', '', '', '', 1, 0, 'F', '0', '0', 'ticket:ai:evaluation:run', '#', 'admin', sysdate(), '', NULL, '');
