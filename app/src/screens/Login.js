import { useState } from "react";
import { View, StyleSheet, Alert, TextInput, Button } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    // const { error } = await supabase.auth.signInWithPassword({
    //   email: email,
    //   password: password,
    // });

    // if (error) Alert.alert(error.message);
    // setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    // const { error } = await supabase.auth.signUp({
    //   email: email,
    //   password: password,
    // });

    // if (error) Alert.alert(error.message);
    // else Alert.alert("Check your email for the login link!");
    // setLoading(false);
  }

  return (
    <View style={styles.container}>
      <TextInput
        label="Email"
        leftIcon={{ type: "font-awesome", name: "envelope" }}
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="email@address.com"
        autoCapitalize={"none"}
      />
      <TextInput
        label="Password"
        leftIcon={{ type: "font-awesome", name: "lock" }}
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
        placeholder="Password"
        autoCapitalize={"none"}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Sign in"
          disabled={loading}
          onPress={() => signInWithEmail()}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Sign up"
          disabled={loading}
          onPress={() => signUpWithEmail()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  buttonContainer: {
    marginTop: 10,
  },
});
