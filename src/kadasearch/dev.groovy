// copy this to /etc/elasticsearch/scripts folder,
// under the name weightedEventSort.groovy and restart ES service

long dateMillis = doc['field_event_date_from_millis'].value;
long signMillis = doc['field_last_day_to_sign_up_millis'].value;
int datePriority = doc['date_priority'].value;
boolean superId = doc['super_id'].value ? false : true;

long priorityValue = 0;

if (!dateFilterOn) {
    priorityValue = (datePriority != 0) ? 0 : 19999999999999;
}

long signORdate = signMillis ?: dateMillis;
long weightValue = dateMillis ? signORdate + priorityValue : 9999999999999;

return weightValue;