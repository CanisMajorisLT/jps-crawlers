

export default {
        templateUrl: 'client/config-form/config-form.html',
        controller: function($http) {

            this.handleSave = ()=> {
                console.log('saving ');
                console.log(this.data);
                $http.post('/options', JSON.stringify(this.data)).then((response)=> {
                    // koks nors servisas
                    console.log('Saved successfully', response);
                }, (error)=> {
                    console.error('Failed to save', error);
                    // koks nors servisas
                })

            };

            $http({
                method: 'GET',
                url: '/options'
            }).then((response)=> {
                this.data = response.data;
            }, (error)=> {
                console.log('error', error);
            });
        }
    }
