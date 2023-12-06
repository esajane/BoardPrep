from django import forms
from .models import Lesson, Course
from django_ckeditor_5.widgets import CKEditor5Widget
from ckeditor_uploader.widgets import CKEditorUploadingWidget
class LessonForm(forms.ModelForm):
    # Add a choice field for selecting an existing courses
    content = forms.CharField(widget=CKEditor5Widget(config_name='extends'))
    existing_course = forms.ModelChoiceField(queryset=Course.objects.all(), required=False)

    class Meta:
        model = Lesson
        fields = ['existing_course', 'lesson_id', 'lesson_title', 'order', 'content']
        widgets = {
            "text": CKEditor5Widget(
                attrs={"class": "django_ckeditor_5"}, config_name="extends"
            )
        }


        def __init__(self, *args, **kwargs):
            super(LessonForm, self).__init__(*args, **kwargs)
            self.fields['lesson_id'].widget.attrs.update({'class': 'form-control'})
            self.fields['lesson_title'].widget.attrs.update({'class': 'form-control'})
            self.fields['order'].widget.attrs.update({'class': 'form-control'})

        def clean_content(self):
            content = self.cleaned_data.get('content')
            if not content:
                raise forms.ValidationError('This field is required.')
            return content

