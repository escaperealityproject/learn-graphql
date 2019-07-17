################################################################################
For running the container
################################################################################

    cd prisma
    dockerd
    docker-compose up -d

Access prisma GraphQL playground at localhost:4466

################################################################################
To update the prisma for latest schema
################################################################################

    prisma deploy

################################################################################
To run custom node server
################################################################################

    cd ..
    npm start

Access its GraphQL playground at localhost:4000

################################################################################
To kill a container
################################################################################

get container id from
    docker ps
then 
    docker kill {container id}

################################################################################
use sudo with docker commands if the right permissions are not set up
################################################################################

################################################################################
To get logs docker logs -f (container id) 
################################################################################

################################################################################
To access playgrounds with auth
################################################################################

run
    prisma token
to get a token
in prisma playgrounds add http header
{
    "Authorization":"Bearer {token}"
}

################################################################################
prisma delete to delete all data
################################################################################

################################################################################
To get get-schema to work after auth
################################################################################

Create entry for prisma inside extentions in .graphqlconfig
It will make the get-schema command to look for the file locally and not through :4466, which is protected

################################################################################
Changing prisma datamodel
################################################################################

after changing prisma's datamodel, 
    cd ..
    npm run get-schema
To update bindings datamodel
