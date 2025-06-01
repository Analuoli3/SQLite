import { SQLiteDatabase } from "expo-sqlite"
import _tarefa from "../types/tarefa"
import { Button, Text, View, StyleSheet } from "react-native"

type _propsTarefa = {
  dados: _tarefa,
  db: SQLiteDatabase,
  recarregar: any
}

export default function Tarefa(props: _propsTarefa) {
  const concluir = async () => {
    await props.db.runAsync("UPDATE tarefas SET concluido=1 WHERE id=?", props.dados.id);
    await props.recarregar();
  }

  const excluir = async () => {
    await props.db.runAsync("DELETE from tarefas WHERE id=?", props.dados.id);
    await props.recarregar();
  }

  const renderStatus = () => {
    if (props.dados.concluido)
      return <Text style={styles.status}>Concluído</Text>;

    return <Button color="#1ab66f" title="Concluir" onPress={concluir} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.txt}>{props.dados.texto}</Text>

      <View style={styles.botoes}>
        {renderStatus()}
        <View style={{ width: 10 }} /> {/* Espaço entre os botões */}
        <Button color="red" title="Excluir" onPress={excluir} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fdd1d1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    minWidth: '80%',
    maxWidth: '80%',
    alignSelf: 'center',
  },
  txt: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  botoes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    color: 'green',
    fontWeight: 'bold',
  },
});
