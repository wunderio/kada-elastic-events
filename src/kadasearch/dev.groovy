// copy this to /etc/elasticsearch/scripts folder,
// under the name weightedEventSort.groovy and restart ES service

// selector for time field
int datePriority = doc['date_priority'].value;
long dateMillis = doc['field_event_date_from_millis'].value;
long signMillis = doc['field_last_day_to_sign_up_millis'].value;
long signORdate = (signMillis > now) ? signMillis : dateMillis;

// let the algorithm magic begins
long eventLength = Math.max(doc['field_event_date_length'].value, 60000L);
long eventElapsed = queryNow - signORdate;

long wToday = (eventElapsed > -64800000L && eventElapsed < 0L) ? (64800000L+eventElapsed)/3000L : 0L;
double wLength = 1000000000L/eventLength;
double wElapsed = eventElapsed/eventLength;

double startedWeight = (double) Math.log(wToday + wLength + wElapsed);
double pendingWeight = (double) Math.log(wToday + -200000000L/eventElapsed);

double weightValue = (eventElapsed > 0L) ? startedWeight : pendingWeight;

if (!dateFilterOn) {
    weightValue = (datePriority != 0) ? weightValue : (weightValue + -9999999999999);
}

weightValue = dateMillis ? weightValue : -19999999999999;

return weightValue;