import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { Header } from '../../components/Header';
import { LoginDataItem } from '../../components/LoginDataItem';
import { SearchBar } from '../../components/SearchBar';
import {
  Container,
  LoginList,
  Metadata,
  Title,
  TotalPassCount,
} from './styles';

interface LoginDataProps {
  id: string;
  service_name: string;
  email: string;
  password: string;
}

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const [searchText, setSearchText] = useState('');
  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);

  async function loadData() {
    try {
      const dataKey = '@savepass:logins';
      const response = await AsyncStorage.getItem(dataKey);
      const parsedData = response ? JSON.parse(response) : [];

      setSearchListData(parsedData);
      setData(parsedData);
    } catch (err) {
      console.log(err);
      Alert.alert('Não foi possível buscar');
    }
  }

  function handleFilterLoginData() {
    if (searchText.trim()) {
      const filteredData = searchListData.filter((data) => {
        const isValid = data.service_name
          .toLowerCase()
          .includes(searchText.toLowerCase());

        if (isValid) {
          return data;
        }
      });
      setSearchListData(filteredData);
    }
  }

  function handleChangeInputText(text: string) {
    if (!text) {
      setSearchListData(data);
    }

    setSearchText(text);
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  return (
    <>
      <Header
        user={{
          name: 'Rocketseat',
          avatar_url: 'https://i.ibb.co/ZmFHZDM/rocketseat.jpg',
        }}
      />
      <Container>
        <SearchBar
          placeholder='Qual senha você procura?'
          onChangeText={handleChangeInputText}
          value={searchText}
          returnKeyType='search'
          onSubmitEditing={handleFilterLoginData}
          onSearchButtonPress={handleFilterLoginData}
        />

        <Metadata>
          <Title>Suas senhas</Title>
          <TotalPassCount>
            {searchListData.length
              ? `${`${searchListData.length}`.padStart(2, '0')} ao total`
              : 'Nada a ser exibido'}
          </TotalPassCount>
        </Metadata>

        <LoginList
          keyExtractor={(item) => item.id}
          data={searchListData}
          renderItem={({ item: loginData }) => {
            return (
              <LoginDataItem
                service_name={loginData.service_name}
                email={loginData.email}
                password={loginData.password}
              />
            );
          }}
        />
      </Container>
    </>
  );
}
