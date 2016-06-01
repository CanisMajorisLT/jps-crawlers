import angular from 'angular'
import configComponent from './config-form/config-form-component'
import lastCrawlSummaryComponent from './last-crawl-summary/last-crawl-summary-component'
import errorViewer from './error-viewer/error-viewer-component'
import singleErrorViewer from './error-viewer/single-error-viewer-component'
import parseResultViewer from './parse-results-viewer/parse-result-viewer-component'
import singleParseResultViewer from './parse-results-viewer/single-parse-result-viewer-component'

angular.module('app', ['templates'])
        .component('configForm', configComponent)
        .component('lastCrawlSummary', lastCrawlSummaryComponent)
        .component('errorViewer', errorViewer)
        .component('singleErrorViewer', singleErrorViewer)
        .component('parseResultViewer', parseResultViewer)
        .component('singleParseResultViewer', singleParseResultViewer);