ssrc=0x3522cd97
ssrc2=0x880e11ff

test:
	go test -v ./...
run:
	go run cmd/main.go
clean:
	rm *.wav *.pcm

test1:
	tshark -n -r one.pcap -T fields -e rtp.payload rtp.ssrc==$(ssrc) > $(ssrc).pcm
sox:
	sox -t raw -r 8000 -c 1 -b 16 -e signed-integer $(ssrc).pcm $(ssrc).wav