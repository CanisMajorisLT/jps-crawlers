angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("client/config-form/config-form.html","<div class=\"panel-group\" id=\"accordion\" role=\"tablist\" aria-multiselectable=\"true\">\r\n    <div class=\"panel panel-default\">\r\n        <div class=\"panel-heading\" role=\"tab\" id=\"headingOne\">\r\n            <h4 class=\"panel-title\">\r\n                <a role=\"button\" data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapseOne\" aria-expanded=\"false\" aria-controls=\"collapseOne\">\r\n                    <h3>Options</h3>\r\n                </a>\r\n            </h4>\r\n        </div>\r\n        <div id=\"collapseOne\" class=\"panel-collapse collapse\" role=\"tabpanel\" aria-labelledby=\"headingOne\">\r\n            <div class=\"panel-body\">\r\n                <form name=\"options\" class=\"form-horizontal\">\r\n                        <div class=\"col-md-6\">\r\n                            <h4>General</h4>\r\n                            <div class=\"form-group\">\r\n                                <label for=\"interval\" class=\"col-md-6 control-label\">Crawl interval</label>\r\n                                <div class=\"input-group col-md-6\">\r\n                                    <input ng-model=\"$ctrl.data.general.crawlInterval\" type=\"number\" class=\"form-control\" id=\"interval\" required>\r\n                                    <div class=\"input-group-addon\">hours</div>\r\n                                </div>\r\n                            </div>\r\n\r\n                            <div class=\"form-group\">\r\n                                <label for=\"workers\" class=\"col-md-6 control-label\">Workers</label>\r\n                                <div class=\"input-group col-md-6\">\r\n                                    <input ng-model=\"$ctrl.data.general.workers\" type=\"number\" class=\"form-control\" id=\"workers\" required>\r\n                                </div>\r\n                            </div>\r\n\r\n                        </div>\r\n\r\n                        <div class=\"col-md-6\">\r\n                            <h4>Task</h4>\r\n                            <div class=\"form-group\">\r\n                                <label for=\"default_task_delay\" class=\"col-md-6 control-label\">DEFAULT_TASK_DELAY</label>\r\n                                <div class=\"input-group col-md-6\">\r\n                                    <input ng-model=\"$ctrl.data.task.DEFAULT_TASK_DELAY\" type=\"number\" class=\"form-control\" id=\"default_task_delay\" required>\r\n                                    <div class=\"input-group-addon\">ms</div>\r\n                                </div>\r\n                            </div>\r\n\r\n                            <div class=\"form-group\">\r\n                                <label for=\"default_task_requeue\" class=\"col-md-6 control-label\">DEFAULT_TASK_REQUEUE</label>\r\n                                <div class=\"input-group col-md-6\">\r\n                                    <input ng-model=\"$ctrl.data.task.DEFAULT_TASK_REQUEUE\" type=\"number\" class=\"form-control\" id=\"default_task_requeue\" required>\r\n                                    <div class=\"input-group-addon\">times</div>\r\n                                </div>\r\n                            </div>\r\n\r\n                            <div class=\"form-group\">\r\n                                <label for=\"default_task_retry\" class=\"col-md-6 control-label\">DEFAULT_TASK_RETRY</label>\r\n                                <div class=\"input-group col-md-6\">\r\n                                    <input ng-model=\"$ctrl.data.task.DEFAULT_TASK_RETRY\" type=\"number\" class=\"form-control\" id=\"default_task_retry\" required>\r\n                                    <div class=\"input-group-addon\">times</div>\r\n                                </div>\r\n                            </div>\r\n\r\n                            <div class=\"form-group\">\r\n                                <label for=\"default_task_retry_interval\" class=\"col-md-6 control-label\">DEFAULT_TASK_RETRY_INTERVAL</label>\r\n                                <div class=\"input-group col-md-6\">\r\n                                    <input ng-model=\"$ctrl.data.task.DEFAULT_TASK_RETRY_INTERVAL\" type=\"number\" class=\"form-control\" id=\"default_task_retry_interval\" required>\r\n                                    <div class=\"input-group-addon\">ms</div>\r\n                                </div>\r\n                            </div>\r\n\r\n                            <div class=\"form-group\">\r\n                                <span class=\"col-md-6 control-label\"></span>\r\n                                <div class=\"input-group col-md-6\">\r\n                                    <button ng-disabled=\"options.$error.required\" style=\"float: right\" class=\"btn btn-success\" ng-click=\"$ctrl.handleSave()\" type=\"submit\">Save changes</button>\r\n                                </div>\r\n                            </div>\r\n\r\n\r\n                        </div>\r\n                    </form>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n");
$templateCache.put("client/error-viewer/error-viewer.html","<div class=\"panel panel-default\">\r\n    <div class=\"panel-heading\">\r\n        <h3>Latest errors</h3>\r\n    </div>\r\n    <div style=\"max-height: 500px; overflow-y: scroll\" class=\"panel-body\">\r\n        <ul class=\"list-group\">\r\n            <li class=\"list-group-item\">\r\n                <div class=\"row\">\r\n                    <span style=\"display: flex; justify-content: center\" class=\"col-md-2\"><h4>Message</h4></span>\r\n                    <span style=\"display: flex; justify-content: center\" class=\"col-md-2\"><h4>Date</h4></span>\r\n                    <span style=\"display: flex; justify-content: center\" class=\"col-md-1\"><h4>Error</h4></span>\r\n                    <span style=\"display: flex; justify-content: center\" class=\"col-md-1\"><h4>Parser</h4></span>\r\n                    <span style=\"display: flex; justify-content: center\" class=\"col-md-2\"><h4>Validator</h4></span>\r\n                    <span style=\"display: flex; justify-content: center\" class=\"col-md-4\"><h4>Element</h4></span>\r\n                </div>\r\n            </li>\r\n            <single-error-viewer data-error-data=\"error\" ng-repeat=\"error in $ctrl.crawlErrors\"></single-error-viewer>\r\n        </ul>\r\n    </div>\r\n</div>\r\n\r\n");
$templateCache.put("client/error-viewer/single-error-viewer.html","<li class=\"list-group-item\">\r\n    <div class=\"row\">\r\n        <span class=\"col-md-2\">{{$ctrl.errorData.message}}</span>\r\n        <span ng-if=\"$ctrl.errorData.error\" class=\"col-md-2\">{{$ctrl.formattedTimestamp}}</span>\r\n        <span ng-if=\"$ctrl.errorData.error\" class=\"col-md-1\">{{$ctrl.errorData.error.name}}</span>\r\n        <span ng-if=\"$ctrl.errorData.error\" class=\"col-md-1\">{{$ctrl.errorData.error.metaData.parserName}}</span>\r\n        <span ng-if=\"$ctrl.errorData.error\" class=\"col-md-1\">{{$ctrl.errorData.error.metaData.validator}}</span>\r\n        <span ng-if=\"$ctrl.errorData.error\" class=\"col-md-5\">{{$ctrl.errorData.error.metaData.element}}</span>\r\n    </div>\r\n</li>");
$templateCache.put("client/last-crawl-summary/last-crawl-summary.html","<div class=\"panel panel-default\">\r\n    <div class=\"panel-heading\">\r\n        <h3>Latest crawl data (next crawl in {{ctrl.nextCrawlIn}} minutes)</h3>\r\n    </div>\r\n    <div class=\"panel-body\">\r\n        <div class=\"row\">\r\n    <span class=\"col-md-3\">\r\n        <label for=\"lastCrawlDate\" class=\"col-md-3 control-label\">date</label>\r\n        <span id=\"lastCrawlDate\">{{$ctrl.lastCrawlDate}}</span>\r\n    </span>\r\n    <span class=\"col-md-2\">\r\n        <label for=\"duration\" class=\"col-md-6 control-label\">duration</label>\r\n        <span id=\"duration\">{{$ctrl.lastCrawlDuration}} s</span>\r\n    </span>\r\n    <span class=\"col-md-2\">\r\n        <label for=\"sources\" class=\"col-md-6 control-label\">sources</label>\r\n        <span id=\"sources\">{{$ctrl.lastCrawlSources}}</span>\r\n    </span>\r\n    <span class=\"col-md-2\">\r\n        <label for=\"errors\" class=\"col-md-6 control-label\">errors</label>\r\n        <span id=\"errors\">{{$ctrl.lastCrawlErrors}}</span>\r\n    </span>\r\n    <span class=\"col-md-3\">\r\n        <label for=\"adsnumber\" class=\"col-md-6 control-label\">ads parsed</label>\r\n        <span id=\"adsnumber\">{{$ctrl.parsedAdsNumber}}</span>\r\n    </span>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n");
$templateCache.put("client/parse-results-viewer/parse-result-viewer.html","<div class=\"panel panel-default\">\r\n    <div class=\"panel-heading\">\r\n        <h3>Latest parse entries</h3>\r\n    </div>\r\n    <div style=\"max-height: 500px; overflow-y: scroll\" class=\"panel-body\">\r\n        <ul class=\"list-group\">\r\n            <li class=\"list-group-item\">\r\n                <div class=\"row\">\r\n                    <span style=\"display: flex; justify-content: center\" class=\"col-md-1\"><h4>Source</h4></span>\r\n                    <span style=\"display: flex; justify-content: center\" class=\"col-md-2\"><h4>Date</h4></span>\r\n                    <span style=\"display: flex; justify-content: center\" class=\"col-md-2\"><h4>Title</h4></span>\r\n                    <span style=\"display: flex; justify-content: center\" class=\"col-md-1\"><h4>City</h4></span>\r\n                    <span style=\"display: flex; justify-content: center\" class=\"col-md-2\"><h4>Company</h4></span>\r\n                    <span style=\"display: flex; justify-content: center\" class=\"col-md-2\"><h4>Company 2</h4></span>\r\n                    <span style=\"display: flex; justify-content: center\" class=\"col-md-2\"><h4>Url</h4></span>\r\n                </div>\r\n            </li>\r\n            <single-parse-result-viewer data-parse-data=\"data\" ng-repeat=\"data in $ctrl.parsedAds\"></single-parse-result-viewer>\r\n        </ul>\r\n    </div>\r\n</div>\r\n\r\n");
$templateCache.put("client/parse-results-viewer/single-parse-result-viewer.html","<li class=\"list-group-item\">\r\n    <div class=\"row\">\r\n        <span  class=\"col-md-1\">{{$ctrl.parseData.source}}</span>\r\n        <span  class=\"col-md-2\">{{$ctrl.formattedDate}}</span>\r\n        <span  class=\"col-md-2\">{{$ctrl.parseData.parsedData.title}}</span>\r\n        <span  class=\"col-md-1\">{{$ctrl.parseData.parsedData.city}}</span>\r\n        <span  class=\"col-md-2\">{{$ctrl.parseData.parsedData.company}}</span>\r\n        <span  class=\"col-md-2\">{{$ctrl.parseData.parsedData.companySecondary}}</span>\r\n        <span style=\"overflow: hidden; text-overflow: ellipsis; white-space: nowrap\" class=\"col-md-2\">\r\n            <a target=\"_blank\" href=\"{{$ctrl.parseData.parsedData.uri}}\">{{$ctrl.parseData.parsedData.uri}}</a>\r\n        </span>\r\n    </div>\r\n</li>");}]);