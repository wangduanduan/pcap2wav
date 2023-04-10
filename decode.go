package pcap2wav

import (
	"fmt"

	"github.com/google/gopacket"
	"github.com/google/gopacket/layers"
	"github.com/pions/webrtc/pkg/rtp"
	"github.com/zaf/g711"
)

const (
	PCMA = 8
	PCMU = 0
)

type WavPacket struct {
	RTPPacket rtp.Packet
	PCM       []byte
}

func DecodePCM(p gopacket.Packet) *WavPacket {
	if udpLayer := p.Layer(layers.LayerTypeUDP); udpLayer != nil {
		payload := udpLayer.LayerPayload()

		oneRTP := rtp.Packet{}

		if err := oneRTP.Unmarshal(payload); err != nil {
			fmt.Printf("rtp parse error %v", err)
			return nil
		}

		wp := WavPacket{
			RTPPacket: oneRTP,
		}

		switch oneRTP.PayloadType {
		case PCMU:
			wp.PCM = g711.DecodeUlaw(oneRTP.Payload)
			return &wp
		case PCMA:
			wp.PCM = g711.DecodeAlaw(oneRTP.Payload)
			return &wp
		default:
			return nil
		}
	}

	return nil
}
