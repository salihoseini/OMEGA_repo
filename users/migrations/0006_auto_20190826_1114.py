# Generated by Django 2.2 on 2019-08-26 06:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_users_table'),
    ]

    operations = [
        migrations.RenameField(
            model_name='users',
            old_name='table',
            new_name='table_number',
        ),
        migrations.AddField(
            model_name='users',
            name='note',
            field=models.TextField(default=''),
        ),
    ]