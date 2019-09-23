from django.utils import timezone
import jdatetime
date = jdatetime.datetime.now().date()
print(date)
print(str(date).replace('-', '/'))
time =jdatetime.datetime.now().time()
print(time)
print(str(time).split('.')[0][:5])

