from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model as User
from django.core.mail import send_mail
from FileSharingPlatform.settings import EMAIL_HOST


class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User()
        fields = ['name', 'email', 'is_staff']


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserDetailsSerializer(self.user).data

        for k, v in serializer.items():
            data[k] = v
        # data['username'] = self.user.name
        # data['email'] = self.user.email

        return data


class UserCreateSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = User()
        fields = ['pk', 'name', 'email', 'password', 'password1', 'is_staff']
        extra_kwargs = {
            'password': {'write_only': True},
            'pk': {'read_only': True}
        }

    def validate(self, attrs):
        request = self.context.get("request")

        if request.method == "POST":
            if attrs['password1'] != attrs['password']:
                raise serializers.ValidationError({'password': "Password Don't match"})
        else:
            if 'password' in attrs:
                if 'password1' not in attrs:
                    raise serializers.ValidationError({'detail': "Password Don't match"})
                if attrs['password1'] != attrs['password']:
                    raise serializers.ValidationError({'detail': "Password Don't match"})

        return attrs

    def create(self, validated_data):
        validated_data.pop('password1')
        send_mail('Welcome To File Sharing Platform', 'Welcome our website.', EMAIL_HOST, [validated_data['email'], ])
        return User().objects.create_user(**validated_data)
