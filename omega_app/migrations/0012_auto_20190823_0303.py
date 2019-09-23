# Generated by Django 2.2 on 2019-08-22 22:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('omega_app', '0011_auto_20190821_1410'),
    ]

    operations = [
        migrations.CreateModel(
            name='FoodMedia',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('food_id', models.IntegerField(default=0)),
                ('picture', models.ImageField(default='../media/foodImages/default.jpg', upload_to='foodImages/')),
                ('trash', models.BooleanField(default=False)),
            ],
        ),
        migrations.RemoveField(
            model_name='food',
            name='picture',
        ),
    ]
