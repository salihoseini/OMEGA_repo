# Generated by Django 2.2 on 2019-08-27 08:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('omega_app', '0014_order_confirm_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='food',
            name='destination',
            field=models.BooleanField(default=True),
        ),
    ]