import angular from 'angular'
import configComponent from './config-form/form-component'

angular.module('app', ['templates'])
        .component('configForm', configComponent);