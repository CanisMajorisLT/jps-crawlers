
export default {
    bindings: {
        parseData: '<'
    },
    templateUrl: 'client/parse-results-viewer/single-parse-result-viewer.html',
    controller: function() {
        const ctrl = this;
        ctrl.formattedDate = moment(ctrl.parseData.meta.parseDate).format('YYYY-DD-MM hh:ss:mm');
    }
}