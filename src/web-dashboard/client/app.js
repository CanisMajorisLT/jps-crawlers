import angular from 'angular'
import configComponent from './config-form/config-form-component'
import lastCrawlSummaryComponent from './last-crawl-summary/last-crawl-summary-component'

angular.module('app', ['templates'])
        .component('configForm', configComponent)
        .component('lastCrawlSummary', lastCrawlSummaryComponent);