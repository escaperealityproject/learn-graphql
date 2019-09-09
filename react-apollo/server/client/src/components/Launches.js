import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import LaunchItem from "./LaunchItem";

const LAUNCHES_QUERY = gql`
  query LaunchQuery {
    launches {
      flight_number
      mission_name
      launch_date_local
      launch_success
    }
  }
`;

class Launches extends Component {
  render() {
    return (
      <>
        <h1 className="display-5 my-4">Launches</h1>
        <Query query={LAUNCHES_QUERY}>
          {({ loading, error, data }) => {
            if (loading) {
              return <h4>Loading..</h4>;
            }
            if (error) {
              console.log(error);
            }
            return (
              <React.Fragment>
                {data.launches.map(launch => {
                  return (
                    <LaunchItem key={launch.flight_number} launch={launch} />
                  );
                })}
              </React.Fragment>
            );
          }}
        </Query>
      </>
    );
  }
}

export default Launches;
