import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button, Alert, SafeAreaView } from 'react-native';
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
      db.execSync(`CREATE TABLE IF NOT EXISTS tarefa(
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
    <SafeAreaView style={styles.center}>
      <TextInput style={styles.input} value={novaTarefa} onChangeText={setNovaTarefa}/>
      <Button onPress={adicionar} title='Adicionar'/>
      <View>
        {renderLista()}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  input:{
    borderWidth: 1,
  },
  center:{
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});
