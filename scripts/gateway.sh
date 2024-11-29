#!/bin/bash

# Function to get the container IP address using ping
get_container_ip() {
  container_name=$1
  ip=$(dig +short $container_name)
  echo $ip
}

# Function to delete the default gateway and set a new one
set_default_gateway() {
  new_gateway=$1

  # Check if the new gateway is valid
  if [ -z "$new_gateway" ]; then
    echo "No IP address found for container. Exiting..."
    exit 1
  fi

  # Delete the current default gateway
  echo "Deleting current default gateway..."
  ip route del default

  # Set the new default gateway
  echo "Setting new default gateway to $new_gateway..."
  ip route add default via $new_gateway

  echo "Default gateway updated to $new_gateway"
}

# Main script execution

container_name="wireguard"  # Replace with your container name
container_ip=$(get_container_ip $container_name)

if [ -n "$container_ip" ]; then
  echo "Found IP address for $container_name: $container_ip"
  set_default_gateway $container_ip
else
  echo "Failed to get IP address for container $container_name."
fi