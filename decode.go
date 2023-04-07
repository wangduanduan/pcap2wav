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

type Packet struct {
}

func DecodePCM(p gopacket.Packet) (uint32, []byte) {
	if udpLayer := p.Layer(layers.LayerTypeUDP); udpLayer != nil {
		payload := udpLayer.LayerPayload()

		oneRTP := rtp.Packet{}

		if err := oneRTP.Unmarshal(payload); err != nil {
			fmt.Printf("rtp parse error %v", err)
			return 0, nil
		}

		switch oneRTP.PayloadType {
		case PCMU:
			return oneRTP.SSRC, g711.DecodeUlaw(oneRTP.Payload)
		case PCMA:
			return oneRTP.SSRC, g711.DecodeAlaw(oneRTP.Payload)
		default:
			return 0, nil
		}
	}

	return 0, nil
}
