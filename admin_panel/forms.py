from django import forms

from users.models import AdminUser

class AdminAuthenticationForm(forms.ModelForm):

    class Meta:
        model = AdminUser
        fields = ('username', 'password',)

