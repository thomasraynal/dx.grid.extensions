// function baseGrid(scope) {

//     scope.widget = scope.$parent;

//     //refacto: implement inheritance
//     if (!scope.widget.config) scope.widget.config = {};
//     scope.widget.config[attrs.bindto] = {};

//     scope.gridName = attrs.instance;
//     scope.gridOptions = scope.widget[attrs.options];
//     scope.$control = element;

//     if (!scope.widget.gridManagement) scope.widget.gridManagement = {};
//     scope.widget.gridManagement[scope.gridName] = {};

//     scope.widget.currentColumn = null;
//     scope.widget.currentRow = null;

//     var columns = dxGridExtension.isUndefinedOrNull(getConfig('columns')) ? null : getConfig('columns');
//     var groupItems = dxGridExtension.isUndefinedOrNull(getConfig('groupItems')) ? null : getConfig('groupItems');

//     setConfig('columns', columns);
//     setConfig('groupItems', groupItems);

//     scope.isNewGridWidget = dxGridExtension.isUndefinedOrNull(getConfig('columns'));

//     $timeout(() => initializeInternal());

//     scope.$watch(scope.gridOptions.bindingOptions.columns, function() {

//         if (scope.isNewGridWidget) {

//             var columns = getConfig('columns');
//             var groupItems = getConfig('groupItems');

//             var groups = _.transform(columns, function(aggregate, item) {

//                 if (item.dataType === "number") {

//                     var existingGroup = _.find(groupItems, function(group) {
//                         return item.column == item.dataField;
//                     });

//                     if (!dxGridExtension.isUndefinedOrNull(existingGroup)) {
//                         aggregate.push(groupItem);
//                     } else {

//                         var groupItem = createDefaultNumberGroupItem(item.dataField);
//                         aggregate.push(groupItem);
//                     }
//                 }
//             }, []);

//             setConfig('groupItems', groups);
//         }
//     });

//     scope.$watch(scope.gridOptions.bindingOptions.dataSource, function() {

//         var dataSource = getDataSource();

//         if (dxGridExtension.isUndefinedOrNull(dataSource) || dataSource.length == 0) return;

//         _.each(getConfig('customColumns'), function(rule) {
//             customColumnConfiguration.computeCustomColumn(rule, dataSource);
//         });

//         //refacto: should allow new columns
//         if (scope.isNewGridWidget) {

//             var template = dataSource[0];

//             var index = 0;

//             var columns = _.transform(Object.keys(template), function(aggregate, field) {

//                 var columnOption = {
//                     dataField: field,
//                     caption: field,
//                     dataType: "string",
//                     visibleIndex: index++,
//                     format: { type: '', precision: 0 }
//                 };

//                 var existingColumn = _.find(getConfig('columns'), function(c) {
//                     return c.dataField == field
//                 });

//                 if (null != existingColumn) {

//                     aggregate.push(existingColumn);

//                 } else {

//                     for (var i = 0; i < dataSource.length; i++) {


//                         if (!dxGridExtension.isUndefinedOrNull(dataSource[i][field])) {

//                             if (typeof(dataSource[i][field]) === "boolean") {

//                                 columnOption.dataType = "boolean";

//                                 break;
//                             }

//                             if (window.dxGridExtension.isInt(dataSource[i][field])) {

//                                 columnOption.dataType = "number";
//                                 columnOption.format = { type: 'fixedpoint', precision: 0 };
//                                 break;
//                             }

//                             if (window.dxGridExtension.isFloat(dataSource[i][field])) {

//                                 columnOption.dataType = "number";
//                                 columnOption.summaryType = "sum";
//                                 columnOption.format = { type: 'fixedpoint', precision: 2 };
//                                 break;
//                             }

//                             columnOption.dataType = "string";
//                             columnOption.format = { type: '', precision: 0 };

//                             break;
//                         }
//                     };

//                     aggregate.push(columnOption);

//                 }
//             }, []);


//             setConfig('columns', columns);

//             $timeout(() => scope.isNewGridWidget = false);
//         }
//     });

//     function getDataSource() {
//         return Object.byString(scope, scope.gridOptions.bindingOptions.dataSource.dataPath);
//     };

//     function getGridInstance() {
//         if (dxGridExtension.isUndefinedOrNull(scope.$control)) return null;
//         try {
//             //if the grid has been rendered
//             var grid = (scope.widget[scope.gridName].NAME) ? scope.widget[scope.gridName] : scope.$control.find('#flatGrid').dxDataGrid("instance");
//             if (scope.widget[scope.gridName] !== grid) scope.widget[scope.gridName] = grid;
//             return grid;

//         } catch (ex) {
//             return null;
//         }
//     };

//     function setConfig(index, value) {
//         if (dxGridExtension.isUndefinedOrNull(scope.widget.config[scope.gridName])) scope.widget.config[scope.gridName] = {};
//         scope.widget.config[scope.gridName][index] = value;
//     };

//     function getConfig(index) {
//         if (dxGridExtension.isUndefinedOrNull(scope.widget.config[scope.gridName])) scope.widget.config[scope.gridName] = {};
//         return scope.widget.config[scope.gridName][index];
//     };

//     function initializeInternal() {

//         $timeout(() => {

//             var grid = getGridInstance();

//             // fixed conditional formatting
//             if (dxGridExtension.isUndefinedOrNull(grid.option("onCellPrepared"))) {
//                 addEventHandler("onCellPrepared", function(options) {
//                     _.each(getConfig('conditionalFormattingRules'), function(rule) {
//                         conditionalFormattingConfiguration.applyConditionalFormattingExpressionOnCell(options, rule, getDataSource());
//                     });
//                 });
//             }

//             //init context menu
//             addEventHandler("onContextMenuPreparing", function(options) {
//                 if (options.row && options.row.rowType === 'data') {
//                     options.items = getGridMenuItems(options);
//                 }
//             });

//             addEventHandler("customizeColumns", function(columns) {
//                 _.each(columns, function(column) {
//                     column.groupCellTemplate = window.dxGridExtension.groupCellTemplate;
//                 });
//             });


//             var state = getConfig('gridState');

//             if (!dxGridExtension.isUndefinedOrNull(state)) {
//                 var grid = getGridInstance();
//                 grid.state(state);
//             }
//         });
//     };

//     function addEventHandler(ev, handler) {

//         var grid = getGridInstance();

//         var current = grid.option(ev);

//         grid.option(ev, function(options) {
//             if (null != current) current(options);
//             handler(options);
//         });
//     };

//     function getGridMenuItems(element) {

//         scope.widget.gridManagement[scope.gridName].currentColumn = element.column;
//         scope.widget.gridManagement[scope.gridName].currentRow = element.row;

//         return [{
//             text: 'Management - Columns',
//             onItemClick: function() {
//                 scope.widget.gridManagement[scope.gridName].showColumnChooserConsole = true;
//             }
//         }, {
//             text: 'Management - Conditional Formatting',
//             onItemClick: function() {


//                 scope.widget.gridManagement[scope.gridName].showConditionalFormattingConsole = true;

//             }
//         }, {
//             text: 'Management - Custom Columns',
//             onItemClick: function() {

//                 scope.widget.gridManagement[scope.gridName].showCustomColumnConsole = true;
//             }
//         }, {
//             text: 'Current Column - Modify',
//             onItemClick: function() {

//                 scope.widget.gridManagement[scope.gridName].showColumnManagementConsole = true;
//             }
//         }, {
//             text: 'Current Column - Remove Aggregation',
//             onItemClick: function() {

//                 _.remove(scope.widget.config[scope.gridName].groupItems, function(item) {
//                     return item.column === scope.widget.gridManagement[scope.gridName].currentColumn.dataField;
//                 });

//             }
//         }, {
//             text: 'Current Column - Create Aggregation',
//             onItemClick: function() {

//                 if (null == scope.widget.gridManagement[scope.gridName].currentColumn || scope.widget.gridManagement[scope.gridName].currentColumn.dataType == "string") return;

//                 var groupItems = getConfig('groupItems');
//                 if (dxGridExtension.isUndefinedOrNull(groupItems)) return;

//                 var result = _.find(scope.widget.config.groupItems, function(item) {
//                     return item.column === scope.widget.gridManagement[scope.gridName].currentColumn.dataField;
//                 });

//                 if (!dxGridExtension.isUndefinedOrNull(result)) return;

//                 var group = createDefaultNumberGroupItem(scope.widget.gridManagement[scope.gridName].currentColumn.dataField);
//                 scope.widget.config[scope.gridName].groupItems.push(group);

//             }
//         }]
//     };

//     function createDefaultNumberGroupItem(name) {
//         return {
//             column: name,
//             summaryType: "sum",
//             showInGroupFooter: false,
//             alignByColumn: true,
//             valueFormat: { type: 'fixedpoint', precision: 2 },
//             displayFormat: "{0}"
//         };
//     };

//     scope.widget.exportExcel = function() {

//         var grid = getGridInstance();
//         grid.option("export", {
//             enabled: false,
//             fileName: scope.widget.container._config.title + "_" + moment(scope.widget.workspace.date).format('YYYYMMDD')
//         });

//         grid.exportToExcel();
//     };



// }
