package main

import (
	"github.com/google/gopacket"
	"github.com/google/gopacket/pcap"

	"pcap2wav"
)

func main() {
	var (
		handle *pcap.Handle
		err    error
	)

	if handle, err = pcap.OpenOffline("one.pcap"); err != nil {
		panic(err)
	}

	packetSource := gopacket.NewPacketSource(handle, handle.LinkType())
	pcap2wav.AddSource(packetSource)
	pcap2wav.WriteWav()
}
