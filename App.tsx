import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button, Alert} from 'react-native';
import{useState, useEffect} from 'react';
import * as SQLite from 'expo-sqlite';
import _tarefa from './types/tarefa';
import Tarefa from './components/Tarefa';


const db = SQLite.openDatabaseSync("to-do.sqlite");

export default function App() {

  const[novaTarefa,setNovaTarefa] =useState<string>('');
  const[tarefas,setTarefas] = useState<_tarefa[]>([]);

  useEffect(
    () =>{
      db.execSync(`CREATE TABLE IF NOT EXISTS tarefas(
        id INTEGER PRIMARY KEY NOT null,
        texto VARCHAR(100),
        concluido INTEGER DEFAULT 0
      )`);
      recarregar();
    }
  ,[]);

const recarregar = async () =>{
  let temp : _tarefa[] = await db.getAllAsync("SELECT * FROM tarefas");
  setTarefas(temp);
}

const adicionar = async() => {
    if(novaTarefa ==""){
      Alert.alert("Insira um texto!")
      return;
    }

    await db.runAsync(`INSERT INTO tarefas (texto) VALUES (?)`, novaTarefa);

    setNovaTarefa('');

    await recarregar();
}

const renderLista = () =>{
  let t = tarefas.map(t => 
    <Tarefa
    dados={t}
    db={db}
    recarregar = {recarregar}
    key={t.id}/>
      );
  return t;
}

  return (
  <View style={styles.center}>
    <TextInput
      style={styles.input}
      value={novaTarefa}
      onChangeText={setNovaTarefa}
      placeholder="Digite uma tarefa..."
      placeholderTextColor="#555"
    />

    <View style={styles.botao}>
      <Button onPress={adicionar} title='★ ADICIONAR TAREFA ★' color="pink" />
    </View>

    <View style={styles.lista}>
      {renderLista()}
    </View>
  </View>
);

}
const styles = StyleSheet.create({
  input:{
    borderWidth: 2,
    borderRadius: 20,
    width: '80%',
    height: '5%',
    backgroundColor: '#f8afc6',
    paddingLeft: '5%',
    paddingRight: '5%',
    fontSize: 20,
  },
  center:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ad5069',
  },
    botao: {
    marginTop: 20,
  },
  lista: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
});
