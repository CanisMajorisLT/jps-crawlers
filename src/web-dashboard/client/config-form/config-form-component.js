export default {
    templateUrl: 'client/config-form/config-form.html',
    controller: function($http, dataFetchService) {

        this.handleSave = ()=> {
            console.log('saving ');
            console.log(this.data);
            $http.post('/options', JSON.stringify(this.data)).then((response)=> {
                console.log('Saved successfully', response);
            }, (error)=> {
                console.error('Failed to save', error);
            })

        };

        dataFetchService.getUrl('/options')
            .then((responseData)=> {
                this.data = responseData;
            });
    }
}
