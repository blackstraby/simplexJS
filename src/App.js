//Autores: Jonas Silva Gomes e Rafael Souza de Lana
import React, { Component } from 'react';
import Simplex from "./components/Simplex";
import jsonExemplo from "./public/jsons/ex1.json";
import { Container, Segment, Grid, Button, Icon, Input, Divider, Label } from "semantic-ui-react";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      arquivo: {},
      json: {
        tipo: "",
        objetivo: "",
        retricoes: []
      },
      errors: {}
    };
    this.onChangeFile = this.onChangeFile.bind(this);
    this.lerArquivo = this.lerArquivo.bind(this);
  }

  lerArquivo = (e) => {
    return function (e) {
      try {
        const json = JSON.parse(e.target.result);

        if (json.tipo && json.objetivo && json.restricoes)
          this.setState({
            json: {
              tipo: json.tipo,
              objetivo: json.objetivo,
              restricoes: json.restricoes
            }
          })
        else
          this.setState({ errors: { arquivo: "Arquivo json mal formatado. Você precisa deixar o arquivo no formato do exemplo" } })

      } catch (ex) {
        console.log('Erro ao tentar analisar o arquivo JSON = ' + ex);
        this.setState({ errors: { arquivo: "Arquivo json mal formatado. Você precisa deixar o arquivo no formato do exemplo" } })
      }
    }.bind(this);
  }

  onChangeFile = (e) => {
    const mimeArquivo = ["application/json"];
    var arquivos = e.target.files; // objeto FileList

    this.setState({ errors: {} })
    if (!arquivos || !arquivos[0]) {
      return this.setState({ errors: { arquivo: "Você precisa selecionar um arquivo" } })
    } else if (!mimeArquivo.includes(arquivos[0].type)) {
      return this.setState({ errors: { arquivo: "O formato do arquivo precisa ser do tipo json" } })
    }

    // arquivos é um FileList de objetos File.
    var reader = new FileReader();
    reader.onload = this.lerArquivo(arquivos[0]);
    reader.readAsText(arquivos[0])
  }

  render() {
    const { json, errors } = this.state;

    return (
      <Container fluid>
        <h2>SimplexJS</h2>
        <Grid doubling columns={2} divided>
          <Grid.Row stretched>
            <Grid.Column>
              <Segment padded>
                <h4>Você pode selecionar um arquivo JSON no mesmo formato do exemplo:</h4>
                <Button as={"label"} htmlFor="arquivo" color="blue">
                  <Icon name="file alternate outline" /> Arquivo JSON
                </Button>
                <Input
                  type="file"
                  name="arquivo"
                  id="arquivo"
                  style={{ display: "none" }}
                  onChange={this.onChangeFile}
                  accept="aplication/json"
                />
                {(errors.arquivo) ? <p className="erro">{errors.arquivo}</p> : (false)}
                <Divider hidden />
                <pre className="json">
                  {(json.restricoes) ? JSON.stringify(json, null, 2) : "O conteúdo do seu arquivo JSON aparecerá aqui"}
                </pre>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment padded>
                <h4>Exemplo de arquivo JSON:</h4>
                <pre className="json">
                  {JSON.stringify(jsonExemplo, null, 2)}
                </pre>
                <Divider hidden />
                <Label attached='bottom'><Icon name="info circle" /> Todas as variáveis devem ser representadas por x1, x2, x3...</Label>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid doubling columns={1} divided>
          <Grid.Row stretched>
            <Grid.Column>
              <Segment padded>
                <Simplex entrada={json} />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container >
    );
  }
}

export default App;
