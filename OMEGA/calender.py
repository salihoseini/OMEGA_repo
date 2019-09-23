from django.utils import timezone
import jdatetime
def convert_day(gregorian_day):
    days = {"Sat" : "شنبه",
            "Sun" : "یکشنبه",
            "Mon" : "دوشنبه",
            "Tue" : "سه شنبه",
            "Wed" : "چهارشنبه",
            "Thu" : "پنجشنبه",
            "Fri" : "جمعه"}
    return days[gregorian_day]


def conver_month(gregorian_month):
    monthes = {"Far" : "فروردین",
               "Ord" : "اردیبهشت",
               "Kho" : "خرداد",
               "Tir" : "تیر",
               "Mor" : "مرداد",
               "Sha" : "شهریور",
               "Meh" : "مهر",
               "Aba" : "آبان",
               "Aza" : "آذر",
               "Dey" : "دی",
               "Bah" : "بهمن",
               "Esf" : "اسفند"}
    return monthes[gregorian_month]



'''
t2 = timezone.datetime(2019, 8, 21)
t3 = jdatetime.datetime.fromgregorian(datetime=t2)
print(t3.year)
print(t3.day)
print(convert_day(t3.strftime("%c")[:3]))
print(conver_month(t3.strftime("%c")[4:7]))

'''