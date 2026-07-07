SET NAMES utf8mb4;

-- v1.1 SLA 时效管理菜单（依赖 v1.0 的 1100 工单管理目录）

DELETE FROM sys_menu WHERE menu_id BETWEEN 1116 AND 1122;

-- 二级菜单：SLA 策略
INSERT INTO sys_menu VALUES ('1116', 'SLA 策略', '1100', '3', 'sla', 'ticket/sla/index', '', 'TicketSla', 1, 0, 'C', '0', '0', 'ticket:sla:list', 'time', 'admin', sysdate(), '', NULL, 'SLA 策略菜单');

-- 二级菜单：SLA 告警
INSERT INTO sys_menu VALUES ('1117', 'SLA 告警', '1100', '4', 'sla-alert', 'ticket/sla-alert/index', '', 'TicketSlaAlert', 1, 0, 'C', '0', '0', 'ticket:sla-alert:list', 'bell', 'admin', sysdate(), '', NULL, 'SLA 告警菜单');

-- SLA 策略按钮权限（挂 1116）
INSERT INTO sys_menu VALUES ('1118', 'SLA 策略详情', '1116', '1', '', '', '', '', 1, 0, 'F', '0', '0', 'ticket:sla:query', '#', 'admin', sysdate(), '', NULL, '');
INSERT INTO sys_menu VALUES ('1119', '新增 SLA 策略', '1116', '2', '', '', '', '', 1, 0, 'F', '0', '0', 'ticket:sla:add', '#', 'admin', sysdate(), '', NULL, '');
INSERT INTO sys_menu VALUES ('1120', '修改 SLA 策略', '1116', '3', '', '', '', '', 1, 0, 'F', '0', '0', 'ticket:sla:edit', '#', 'admin', sysdate(), '', NULL, '');

-- SLA 告警按钮权限（挂 1117）
INSERT INTO sys_menu VALUES ('1121', 'SLA 告警详情', '1117', '1', '', '', '', '', 1, 0, 'F', '0', '0', 'ticket:sla-alert:query', '#', 'admin', sysdate(), '', NULL, '');
INSERT INTO sys_menu VALUES ('1122', 'SLA 手工扫描', '1117', '2', '', '', '', '', 1, 0, 'F', '0', '0', 'ticket:sla-alert:scan', '#', 'admin', sysdate(), '', NULL, '');
