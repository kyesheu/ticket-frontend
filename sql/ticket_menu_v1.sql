-- v1.0 工单管理菜单
-- 在前端数据库的 sys_menu 表中执行

-- 一级目录：工单管理
INSERT INTO sys_menu VALUES ('1100', '工单管理', '0', '5', 'ticket', NULL, '', 'Ticket', 1, 0, 'M', '0', '0', NULL, 'ticket', 'admin', sysdate(), '', NULL, '工单管理目录');

-- 二级菜单：工单列表
INSERT INTO sys_menu VALUES ('1101', '工单列表', '1100', '1', 'ticket', 'ticket/ticket/index', '', 'TicketList', 1, 0, 'C', '0', '0', 'ticket:ticket:list', 'list', 'admin', sysdate(), '', NULL, '工单列表菜单');

-- 二级菜单：分类管理
INSERT INTO sys_menu VALUES ('1102', '分类管理', '1100', '2', 'category', 'ticket/category/index', '', 'TicketCategory', 1, 0, 'C', '0', '0', 'ticket:category:list', 'tree', 'admin', sysdate(), '', NULL, '分类管理菜单');

-- 按钮权限：工单
INSERT INTO sys_menu VALUES ('1103', '工单详情', '1101', '1', '', '', '', '', 1, 0, 'F', '0', '0', 'ticket:ticket:query', '#', 'admin', sysdate(), '', NULL, '');
INSERT INTO sys_menu VALUES ('1104', '新增工单', '1101', '2', '', '', '', '', 1, 0, 'F', '0', '0', 'ticket:ticket:add', '#', 'admin', sysdate(), '', NULL, '');
INSERT INTO sys_menu VALUES ('1105', '分派工单', '1101', '3', '', '', '', '', 1, 0, 'F', '0', '0', 'ticket:ticket:assign', '#', 'admin', sysdate(), '', NULL, '');
INSERT INTO sys_menu VALUES ('1106', '处理工单', '1101', '4', '', '', '', '', 1, 0, 'F', '0', '0', 'ticket:ticket:process', '#', 'admin', sysdate(), '', NULL, '');
INSERT INTO sys_menu VALUES ('1107', '确认工单', '1101', '5', '', '', '', '', 1, 0, 'F', '0', '0', 'ticket:ticket:confirm', '#', 'admin', sysdate(), '', NULL, '');
INSERT INTO sys_menu VALUES ('1108', '取消工单', '1101', '6', '', '', '', '', 1, 0, 'F', '0', '0', 'ticket:ticket:cancel', '#', 'admin', sysdate(), '', NULL, '');

-- 按钮权限：评论
INSERT INTO sys_menu VALUES ('1109', '评论列表', '1101', '7', '', '', '', '', 1, 0, 'F', '0', '0', 'ticket:comment:list', '#', 'admin', sysdate(), '', NULL, '');
INSERT INTO sys_menu VALUES ('1110', '添加评论', '1101', '8', '', '', '', '', 1, 0, 'F', '0', '0', 'ticket:comment:add', '#', 'admin', sysdate(), '', NULL, '');

-- 按钮权限：操作日志
INSERT INTO sys_menu VALUES ('1111', '操作日志', '1101', '9', '', '', '', '', 1, 0, 'F', '0', '0', 'ticket:log:list', '#', 'admin', sysdate(), '', NULL, '');

-- 按钮权限：分类管理
INSERT INTO sys_menu VALUES ('1112', '分类详情', '1102', '1', '', '', '', '', 1, 0, 'F', '0', '0', 'ticket:category:query', '#', 'admin', sysdate(), '', NULL, '');
INSERT INTO sys_menu VALUES ('1113', '新增分类', '1102', '2', '', '', '', '', 1, 0, 'F', '0', '0', 'ticket:category:add', '#', 'admin', sysdate(), '', NULL, '');
INSERT INTO sys_menu VALUES ('1114', '修改分类', '1102', '3', '', '', '', '', 1, 0, 'F', '0', '0', 'ticket:category:edit', '#', 'admin', sysdate(), '', NULL, '');
INSERT INTO sys_menu VALUES ('1115', '删除分类', '1102', '4', '', '', '', '', 1, 0, 'F', '0', '0', 'ticket:category:remove', '#', 'admin', sysdate(), '', NULL, '');
