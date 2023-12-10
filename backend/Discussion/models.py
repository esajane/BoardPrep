from django.db import models
from User.models import User


class Post(models.Model):
     author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_posts')
     title = models.CharField(max_length=200)
     content = models.TextField()
     tags = models.CharField(max_length=100, blank=True)
     created_at = models.DateTimeField(auto_now_add=True)
     updated_at = models.DateTimeField(auto_now=True)

     def __str__(self):
         return self.title

class Comment(models.Model):
     post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
     author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_comments')
     content = models.TextField()
     created_at = models.DateTimeField(auto_now_add=True)

     def __str__(self):
         return f'Comment by {self.author} on {self.post}'

class Like(models.Model):
     post = models.ForeignKey(Post, related_name='likes', on_delete=models.CASCADE)
     user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_likes')
     created_at = models.DateTimeField(auto_now_add=True)

     class Meta:
         unique_together = ('post', 'user')

     def __str__(self):
         return f'Like by {self.user} on {self.post}'