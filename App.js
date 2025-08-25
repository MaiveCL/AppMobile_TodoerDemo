import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableHighlight, ScrollView, Switch, Button, Text, TextInput } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ToastManager, { Toast } from 'toastify-react-native'
import { Dialog } from 'react-native-simple-dialogs';
import { Ionicons } from '@expo/vector-icons';


function TodoItem({ todo, isLast, setToggling }) {
  return (
    <TouchableHighlight onPress={ () => setToggling(todo) }>
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            paddingVertical: 16,
            paddingHorizontal: 8,
            backgroundColor: 'white', /* requis pour highlight */
            borderBottomWidth: isLast ? 0 : 1,
            borderBottomColor: 'lightgray'
          }}
        >
            <Ionicons name="checkmark-circle" size={22} color={  todo.done ? 'green' : 'lightgray' } />

            <View style={{ flex: 1, flexDirection: 'column' }}>
                <Text style={[styles.text, { fontWeight: 'bold' }]}>{ todo.name }</Text>
                {
                  !!todo.description &&
                    <Text style={ styles.text }>{ todo.description }</Text>
                }
            </View>
        </View>
    </TouchableHighlight>
  )
}

export default function App() {

  const EMPTY_TODO = () => { return {
    name: null,
    done: false,
    description: null
  }}

  const SEED_COUNT = 4;
  const SEED = [...Array(SEED_COUNT).keys()].map((item, index, array) => {
    const name = `Todo ${item}`

    return {
      id: Math.random().toString(16).substring(2),
      name: name,
      description: `Description ${name} `.repeat(index),
      done: (index % 3)
    }
  })

  const [todos, setTodos] = useState(SEED);
  const [newTodo, setNewTodo] = useState(EMPTY_TODO());
  const [toggling, setToggling] = useState(null)

  function add() {
    if ((newTodo.name?.trim() ?? '') == '') {
        Toast.error('Provide a Todo name', 'bottom')
    } else {
        newTodo.id = Math.random().toString(16).substring(2);
        newTodo.name = newTodo.name.trim()

        setTodos([newTodo, ...todos]);

        setNewTodo(EMPTY_TODO());
    }
  }

  function toggle(id) {
    setTodos(
        todos.map( t => {
            if (t.id == id) {
                return {
                    ...t,
                    done : !t.done
                }
            }

            return t;
        })
    )
  }

  function list() {
    if (todos.length == 0) {
        return (
            <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 48, color: 'gray' }}>No todos...</Text>
            </View>
        )
    } else {
      /* Pas la facon ideale pour afficher une liste, simplification pour la demonstration */
      return (
          <ScrollView style={{ flexGrow: 1 }}>
          {
            todos.map((todo, index, array) => {
              return (
                <TodoItem
                  key={todo.id}
                  todo={ todo }
                  isLast={ index + 1 == array.length }
                  setToggling={ setToggling }
                />
                )
            })
          }
          </ScrollView>
      )
    }
  }

  return (
    <>
        <StatusBar style="auto" />
        <ToastManager />

        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>

              <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center' }}>Todoer Starter</Text>

              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>

                <TextInput
                  style={[styles.input, { height: 48, flexGrow: 1 }]}
                  placeholder='New task'
                  value={ newTodo.name ?? ''}
                  onChangeText={ (text) => setNewTodo({...newTodo, name: text}) }
                />

                <Switch
                  value={ newTodo.done }
                  onValueChange={ checked => setNewTodo({...newTodo, done: checked}) }
                />

              </View>

              <TextInput
                style={[styles.input, { width: '100%', height: 96, verticalAlign: 'top' }]}
                placeholder='Optional description'
                multiline={ true }
                value={ newTodo.description ?? '' }
                onChangeText={ (text) => setNewTodo({ ...newTodo, description: text }) }
              />

              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              {/* Envelopper dans une View pour eviter une largeur de 100% */}

                  <Button
                    title='Add'
                    color='green'
                    onPress={ add }
                  />

              </View>

              { list() }

              <Dialog
                title={ toggling?.name }
                visible={ !!toggling }
                onTouchOutside={ () => setToggling(null) }
                animationType="fade"
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 32 }}>
                  <Button title="Cancel" color="gray" onPress={ () => setToggling(null) } />
                  <Button title={ toggling?.done ? 'Incomplete' : 'Completed' } onPress={ () => { setToggling(false); toggle(toggling?.id); } } />
                </View>
              </Dialog>

            </SafeAreaView>
        </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 8,
  },
  text: {
    fontSize: 18,
  },
});