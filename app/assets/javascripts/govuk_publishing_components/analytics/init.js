var analyticsInit = function () {
  // 'use strict'
  console.log('initialising analytics', analyticsInit.caller)

  var analyticsVars = window.GOVUK.analyticsVars || false
  if (analyticsVars) {
    var gaProperty = window.GOVUK.analyticsVars.gaProperty || false
    var gaPropertyCrossDomain = window.GOVUK.analyticsVars.gaPropertyCrossDomain || false
    var linkedDomains = window.GOVUK.analyticsVars.linkedDomains || false
  }

  var consentCookie = window.GOVUK.getConsentCookie()
  var dummyAnalytics = {
    addLinkedTrackerDomain: function () {},
    setDimension: function () {},
    setOptionsForNextPageView: function () {},
    trackEvent: function () {},
    trackPageview: function () {},
    trackShare: function () {}
  }

  // Disable analytics by default
  // This will be reversed below, if the consent cookie says usage cookies are allowed
  var disabler = 'ga-disable-' + gaProperty
  window[disabler] = true

  if (consentCookie && consentCookie.usage) {
    window[disabler] = false

    // Load Google Analytics libraries
    window.GOVUK.StaticAnalytics.load()

    if (gaProperty) {
      // Use document.domain in dev, preview and staging so that tracking works
      // Otherwise explicitly set the domain as www.gov.uk (and not gov.uk).
      var cookieDomain = (document.domain === 'www.gov.uk') ? '.www.gov.uk' : document.domain

      // Configure profiles, setup custom vars, track initial pageview
      var analytics = new window.GOVUK.StaticAnalytics({
        universalId: gaProperty,
        cookieDomain: cookieDomain,
        allowLinker: true
      })

      // Make interface public for virtual pageviews and events
      window.GOVUK.analytics = analytics

      if (linkedDomains && linkedDomains.length > 0) {
        window.GOVUK.analytics.addLinkedTrackerDomain(gaPropertyCrossDomain, 'govuk', linkedDomains)
      }
    }
  } else {
    window.GOVUK.analytics = dummyAnalytics
  }
}

window.GOVUK.analyticsInit = analyticsInit
