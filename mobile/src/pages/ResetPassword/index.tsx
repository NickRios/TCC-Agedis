import React, { useRef, useCallback } from 'react'
import Icon from 'react-native-vector-icons/Feather'
import { Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup'
import api from '../../services/api'

import getValidationErrors from '../../utils/getValidationErrors'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { Container, Title, BackToSignIn, BackToSignInText  } from './styles'

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'No mínimo 6 digitos'),
          });

          await schema.validate(data, {
            abortEarly: false,
          });

          await api.post('/users', data)

          Alert.alert('Cadastro realizado com sucesso!', 'Você já pode fazer login na aplicação')

          navigation.goBack();
      } catch (err) {

        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro no cadastro',
          'Ocorreu um erro ao fazer cadastro, tente novamente.',
        )

      }
    }, [navigation],
  );

  return (
    <>
      <Container>
        <Title>Redefina sua Senha</Title>

        <Form
            ref={formRef}
            onSubmit={handleSignUp}>
            <Input
              keyboardType="email-address"
              name="email"
              icon="mail"
              placeholder="Email"
            />

            <Button onPress={() => formRef.current?.submitForm()}>
              Enviar
            </Button>
        </Form>

      </Container>

      <BackToSignIn onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#212020" />
        <BackToSignInText>Voltar para Login</BackToSignInText>
      </BackToSignIn>
    </>
  )
}

export default SignUp;
