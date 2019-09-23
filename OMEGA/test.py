from django.utils import timezone
import time
import jdatetime
t1 = timezone.datetime(2019, 6, 10)
time.sleep(2)
t2 = timezone.datetime.now()
t3 = jdatetime.datetime.fromgregorian(datetime=t1)
print(t3.strftime("%c"))
print(t1.strftime("%c"))
print(((t2 - t1).seconds / 3600))