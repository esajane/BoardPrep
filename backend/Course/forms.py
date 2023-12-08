from django import forms
from .models import Page, Course, Lesson, Syllabus
from django_ckeditor_5.widgets import CKEditor5Widget
from ckeditor_uploader.widgets import CKEditorUploadingWidget


class PageForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditor5Widget(config_name='extends'))
    existing_lesson = forms.ModelChoiceField(
        queryset=Lesson.objects.all(), required=False, label="Select an existing lesson"
    )
    existing_syllabus = forms.ModelChoiceField(
        queryset=Syllabus.objects.all(), required=False, label="Select an existing syllabus"
    )
    page_number = forms.IntegerField(required=True, help_text="Page number within the lesson")

    class Meta:
        model = Page
        fields = ['existing_syllabus', 'existing_lesson', 'page_number', 'content']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['page_number'].widget.attrs.update({'class': 'form-control'})

    def clean_content(self):
        content = self.cleaned_data.get('content')
        if not content:
            raise forms.ValidationError('This field is required.')
        return content

class PageEditForm(forms.ModelForm):
    content = forms.CharField(widget=CKEditor5Widget(config_name='extends'))

    class Meta:
        model = Page
        fields = ['content']

    def clean_content(self):
        content = self.cleaned_data.get('content')
        if not content:
            raise forms.ValidationError('This field is required.')
        return content
