//3 conceitos principais do react
//Componente - Bloco isolado de html, css e js, o qual não interfere no restante da aplicação
//Propriedades - Informações que o componente pai passa para o componente filho
//Estado - Informações mantidas pelo componente (lembrar imutabilidade)

// <> - conceito do fragment, para renderizar varios componentes dentro do return sem usar uma div por exemplo
import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

import './global.css';
import './App.css';
import './Sidebar.css';
import './Main.css';

import DevItem from '../DevItem';
import DevForm from '../DevForm';
import { sp } from '@pnp/sp';

export const App: React.FunctionComponent = () => { 

  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function loadDevs() {      
      sp.web.lists
        .getByTitle("Devs")
        .select("ID, name, githubUsername, techs, avatarUrl, bio")
        .items.top(5000)
        .get()
        .then(items => {          
          setDevs(items);
        },
        (err) => {
          console.log(err);
        });      
    }

    loadDevs();

  }, []);

  async function handleAddDev(data) {

    const { github_username, techs, latitude, longitude } = data;
    const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    const { name, avatar_url, bio } = apiResponse.data;
    
    sp.web.lists.getByTitle("Devs").items.add({
      githubUsername: github_username,
      name: name,
      avatarUrl: avatar_url,
      bio: bio,
      techs: techs,
      latitude: latitude,
      longitude: longitude
    }).then(i => {          
        console.log(i);
        setDevs([...devs, i.data]);
    },
    (err) => {
      console.log(err);            
    });

  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleAddDev} />
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <DevItem key={dev.ID} dev={dev} />
          ))}
        </ul>
      </main>
    </div>
  );

};