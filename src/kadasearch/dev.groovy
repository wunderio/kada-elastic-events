// Copy this to /etc/elasticsearch/scripts folder,
// under the name weightedEventSort.groovy and restart ES service.

// This script implements sorting for KADA Elastic Event Search.
//
// The weighting is based on these terms:
// - event length, or 60 seeconds, whichever is larger;
//   there may be 0-length events and this prevents division by zero
// - how much of event is elapsed (can be negative for future events)
// - whether the event begins in the next 18 hours (64800 seconds)
//
// Based on those, three weight terms are computed:
// - wToday, which increases as events get further from the 18 hour "horizon";
//   this is scaled to push upcoming sub-events just above masters/single events
// - wLength, which is just a magic number divided by the event length;
//   this pushes shorter events above longer ones; the idea is that there
//   has already been more time to visit long events (e.g. exhibitions)
// - wElapsed, which pushes up events that are close to their ending date
//
// Finally, depending on whether the event has started or not, one of two sorting
// weights is returned:
// - a natural logarithm of wToday + wLength + wElapsed, or
// - a natural logarithm of wToday + an inverse eventElapsed term that
//   sorts pending events in the order they begin.
//
// See elasticsearch provisioning for policy file that controls
// which classes are available for import in this environment.

int datePriority = doc['date_priority'].value;
long dateMillis = doc['field_event_date_from_millis'].value;
long signMillis = doc['field_last_day_to_sign_up_millis'].value;
long signORdate = (signMillis > now) ? signMillis : dateMillis;
long comparativeQuery = queryNow + 10000000;

long eventLength = Math.max(doc['field_event_date_length'].value, 60000L);
long eventElapsed = (long) comparativeQuery - signORdate;

long wToday = (eventElapsed > -64800000L && eventElapsed < 0L) ? (64800000L+eventElapsed)/3000L : 0L;
double wLength = 1000000000L/eventLength;
double wElapsed = eventElapsed/eventLength;

double startedWeight = (double) Math.log(wToday + wLength + wElapsed);
double pendingWeight = (double) Math.log(wToday + -200000000L/eventElapsed);

double weightValue = (eventElapsed > 0L) ? startedWeight : pendingWeight;

// In case of multiple hobby events, drop the future events to the end. 
// Implement this only when the date filter is on.

if (!dateFilterOn) {
    weightValue = (datePriority != 0) ? weightValue : (weightValue + -9999999999999);
}

// Send the hobby locations to the end.

weightValue = dateMillis ? weightValue : -19999999999999;

return weightValue;