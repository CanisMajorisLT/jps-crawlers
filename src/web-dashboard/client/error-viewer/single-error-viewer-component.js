
export default {
    bindings: {
        errorData: '<'
    },
    templateUrl: 'client/error-viewer/single-error-viewer.html',
    controller: function() {
        const ctrl = this;
        ctrl.formattedTimestamp = moment(ctrl.errorData.timestamp).format('YYYY-DD-MM hh:ss:mm');
    }
}