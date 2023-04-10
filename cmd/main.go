package main

import (
	"log"

	"github.com/google/gopacket"
	"github.com/google/gopacket/pcap"

	"os"
	"pcap2wav"

	"github.com/urfave/cli/v2"
)

func Exec(file string) {
	var (
		handle *pcap.Handle
		err    error
	)

	if handle, err = pcap.OpenOffline(file); err != nil {
		panic(err)
	}

	packetSource := gopacket.NewPacketSource(handle, handle.LinkType())
	pcap2wav.AddSource(packetSource)
	pcap2wav.WriteWav()
}

func main() {

	cli.VersionFlag = &cli.BoolFlag{
		Name:    "print-version",
		Aliases: []string{"V"},
		Usage:   "print only the version",
	}

	app := &cli.App{
		Name:    "pcap2wav",
		Version: "v0.0.1",
		Usage:   "pcap file to wav",
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:  "in",
				Value: "",
				Usage: "pcap file for read",
			},
		},
		Action: func(c *cli.Context) error {
			file := c.String("in")

			if file == "" {
				return cli.Exit("file is empty", 1)
			}

			Exec(file)

			return nil
		},
	}

	if err := app.Run(os.Args); err != nil {
		log.Fatal(err)
	}
}
