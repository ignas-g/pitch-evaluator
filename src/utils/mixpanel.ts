import mixpanel from "mixpanel-browser";
mixpanel.init(process.env.MIXPANEL_TOKEN as string);

export function getReferralCodeFromUrl() {
  // fix window undefined error in server side rendering
  if (typeof window === 'undefined') {
    console.log('window is undefined');
    return undefined;
  }
  const currentUrl = window?.location?.href;
  console.log('window?.location', window?.location, currentUrl);
  if(!currentUrl) {
    return undefined;
  }
  // parse url
  const parsedUrl = new URL(currentUrl);

  // Pass the search parameters to the URLSearchParams constructor
  const searchParams = new URLSearchParams(parsedUrl.search);

  // Access the value of the 'ref' parameter
  const refValue = searchParams.get('ref');
  return refValue;
}

export function trackEvent(eventName: string, properties?: any) {
  const referralCode = getReferralCodeFromUrl();
  mixpanel.track(eventName, {
    ...properties,
    referralCode,
  });
}
